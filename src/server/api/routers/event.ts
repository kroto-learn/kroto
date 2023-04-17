import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createFormSchema } from "@/pages/event/create";
import { TRPCError } from "@trpc/server";
import { imageUpload } from "@/server/helpers/base64ToS3";
import isBase64 from "is-base64";

export const eventRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.id,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: event?.creatorId,
        },
      });

      const registrationsIds = await prisma.registration.findMany({
        where: {
          eventId: event?.id,
        },
      });

      const registrations = await prisma.user.findMany({
        where: {
          id: { in: registrationsIds.map((r) => r.userId) },
        },
      });

      return { ...event, creator: user, registrations };
    }),

  // User for RouterOutputs don't remove.
  getEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      const event = prisma.event.findUnique({
        where: {
          id: input.id,
        },
      });

      return event;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const events = await prisma.event.findMany({
      where: {
        creatorId: ctx.session.user.id,
        datetime: {
          gte: new Date(),
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });

    return events;
  }),

  getAllPast: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const events = await prisma.event.findMany({
      where: {
        creatorId: ctx.session.user.id,
        datetime: {
          lte: new Date(),
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });

    return events;
  }),

  isRegistered: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      if (!ctx.session) return null;

      const registration = prisma.registration.findFirst({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });

      return registration;
    }),

  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      const event = await prisma.event.create({
        data: {
          title: input.title,
          description: input.description,
          datetime: input.datetime,
          eventUrl: input.eventUrl ?? "",
          eventLocation: input.eventLocation ?? "",
          eventType: input.eventType,
          duration: input.duration,

          creatorId: ctx.session.user.id,
        },
      });

      const thumbnail = await imageUpload(input.thumbnail, event.id, "event");

      const updatedEvent = await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          thumbnail,
        },
      });

      return updatedEvent;
    }),

  update: protectedProcedure
    .input(createFormSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      let thumbnail = input.thumbnail;
      if (isBase64(input.thumbnail, { allowMime: true }))
        thumbnail = await imageUpload(input.thumbnail, input.id, "event");

      const event = await prisma.event.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          datetime: input.datetime,
          eventUrl: input.eventUrl ?? "",
          eventLocation: input.eventLocation ?? "",
          eventType: input.eventType,
          duration: input.duration,
          thumbnail: thumbnail,

          creatorId: ctx.session.user.id,
        },
      });

      return event;
    }),

  register: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: { id: input.eventId },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!event || !user) return new TRPCError({ code: "BAD_REQUEST" });

      if (event.creatorId === user.id)
        return new TRPCError({ code: "BAD_REQUEST" });

      const registration = await prisma.registration.create({
        data: {
          userId: user.id,
          eventId: event.id,
        },
      });

      /* TODO thid doesn't seem like the proper way to do this hit */

      const audienceMember = await prisma.audienceMember.findFirst({
        where: {
          email: user.email,
          creatorId: event.creatorId,
        },
      });

      const hosts = await prisma.host.findMany({
        where: {
          eventId: event.id,
        },
      });

      /* Adding to audience list */
      if (!audienceMember) {
        // Create audience member for the creator
        await prisma.audienceMember.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            creatorId: event.creatorId,
          },
        });
      }
      // Create audience member for all hosts
      for (const host of hosts) {
        const audienceMember = await prisma.audienceMember.findFirst({
          where: {
            email: user.email,
            creatorId: host.userId,
          },
        });

        if (!audienceMember)
          await prisma.audienceMember.create({
            data: {
              email: user.email,
              name: user.name,
              userId: user.id,
              creatorId: host.userId,
            },
          });
      }

      return registration;
    }),

  getHosts: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!event) return new TRPCError({ code: "BAD_REQUEST" });

      const creator = await prisma.user.findUnique({
        where: {
          id: event?.creatorId,
        },
      });

      const hosts = await prisma.host.findMany({
        where: {
          eventId: event.id,
        },
      });

      const hostWithUserData = await prisma.user.findMany({
        where: {
          id: { in: hosts.map((h) => h.userId) },
        },
      });

      return [creator, ...hostWithUserData];
    }),

  addHost: protectedProcedure
    .input(z.object({ eventId: z.string(), creatorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: { id: input.eventId },
      });

      const user = await prisma.user.findUnique({
        where: {
          creatorProfile: input.creatorId,
        },
      });

      if (!event || !user) return new TRPCError({ code: "BAD_REQUEST" });
      if (!user.isCreator) return new TRPCError({ code: "BAD_REQUEST" });

      const isHost = await prisma.host.findFirst({
        where: {
          userId: user.id,
          eventId: event.id,
        },
      });

      if (!isHost) {
        const host = await prisma.host.create({
          data: {
            userId: user.id,
            eventId: event.id,
          },
        });
        return host;
      }
      return new TRPCError({ code: "BAD_REQUEST" });
    }),

  removeHost: protectedProcedure
    .input(z.object({ hostId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const host = await prisma.host.delete({
        where: {
          id: input.hostId,
        },
      });

      return host;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.delete({
        where: {
          id: input.id,
        },
      });

      return event;
    }),
});
