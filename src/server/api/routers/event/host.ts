import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const hostRouter = createTRPCRouter({
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
        include: {
          user: true,
        },
      });

      return [{ id: creator?.id, user: creator }, ...hosts];
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      await prisma.host.delete({
        where: {
          id: id,
        },
      });
    }),
});
