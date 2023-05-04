import { z } from "zod";
import type AWS from "aws-sdk";
import { env } from "@/env.mjs";
const { NEXTAUTH_URL } = env;

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createFormSchema } from "@/pages/event/create";
import { TRPCError } from "@trpc/server";
import { imageUpload, ogImageUpload } from "@/server/helpers/base64ToS3";
import isBase64 from "is-base64";
import axios from "axios";
import { sendRegistrationConfirmation } from "@/server/helpers/emailHelper";

export const eventRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
          registrations: {
            include: {
              user: true,
            },
          },
        },
      });

      return event;
    }),

  // Used for RouterOutputs don't remove.
  getEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
          hosts: {
            include: {
              user: true,
            },
          },
        },
      });

      const eventHosts = event?.hosts ?? [];
      const hosts = [
        ...eventHosts,
        { id: event?.creator.id, user: event?.creator },
      ];

      return {
        ...event,
        hosts: hosts,
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const events = await prisma.event.findMany({
      where: {
        creatorId: ctx.session.user.id,
        endTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        datetime: "asc",
      },
    });

    return events;
  }),

  getAllPast: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const events = await prisma.event.findMany({
      where: {
        creatorId: ctx.session.user.id,
        endTime: {
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
          endTime: input.endTime,
          eventUrl: input.eventUrl ?? "",
          eventLocation: input.eventLocation ?? "",
          eventType: input.eventType,
          // duration: input.duration,

          creatorId: ctx.session.user.id,
        },
      });

      const thumbnail = await imageUpload(input.thumbnail, event.id, "event");

      /* Don't use axios, make the api end point a function,
       * and call it if needed from /pages/api/og and here we
       * can just use the function.
       */
      const ogImageRes = await axios({
        url: `${NEXTAUTH_URL ?? "https://kroto.in"}/api/og/event`,
        responseType: "arraybuffer",
        params: {
          title: input.title,
          datetime: input.datetime.getTime(),
          host: ctx.session.user.name ?? "",
        },
      });

      const ogImage = await ogImageUpload(
        ogImageRes.data as AWS.S3.Body,
        event.id,
        "event"
      );

      const updatedEvent = await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          thumbnail,
          ogImage,
        },
      });

      return updatedEvent;
    }),

  update: protectedProcedure
    .input(createFormSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      const checkIsCreator = await prisma.event.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!checkIsCreator)
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Event doesn't exist",
        });

      if (checkIsCreator.creatorId !== ctx.session.user.id)
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "You didn't create this event",
        });

      let thumbnail = input.thumbnail;
      if (isBase64(input.thumbnail, { allowMime: true }))
        thumbnail = await imageUpload(input.thumbnail, input.id, "event");

      const ogImageRes = await axios({
        url: `${NEXTAUTH_URL ?? "https://kroto.in"}/api/og/event`,
        responseType: "arraybuffer",
        params: {
          title: input.title,
          datetime: input.datetime.getTime(),
          host: ctx.session.user.name ?? "",
        },
      });

      const ogImage = await ogImageUpload(
        ogImageRes.data as AWS.S3.Body,
        input.id,
        "event"
      );

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
          thumbnail: thumbnail,
          ogImage,
          endTime: input.endTime,

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
        // if audience member doesn't exist, create one
        await prisma.audienceMember.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            creatorId: event.creatorId,
            eventId: event.id,
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
              eventId: event.id,
            },
          });
      }

      const creator = await prisma.user.findUnique({
        where: {
          id: event.creatorId,
        },
      });

      try {
        await sendRegistrationConfirmation(
          event,
          creator,
          user.email,
          user.name
        );
      } catch (e) {
        console.log(e);
      }

      return registration;
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
