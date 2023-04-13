import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createFormSchema } from "@/pages/event/create";
import { TRPCError } from "@trpc/server";
import { imageUpload, isBase64 } from "@/server/helpers/base64ToS3";

export const eventRouter = createTRPCRouter({
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
      if (isBase64(input.thumbnail))
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

  getEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
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
      },
    });

    return events;
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

      return registration;
    }),

  isRegistered: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      if (!ctx.session.user) return null;

      const registration = prisma.registration.findFirst({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });

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
