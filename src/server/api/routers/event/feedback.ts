import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const feedbacksRouter = createTRPCRouter({
  addFeedback: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        rating: z.number(),
        comment: z.string(),
      })
    )
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

      if (!event || !user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (event.creatorId === ctx.session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const isFeedback = await prisma.feedback.findFirst({
        where: {
          userId: user.id,
          eventId: event.id,
        },
      });

      if (!isFeedback) {
        const feedback = await prisma.feedback.create({
          data: {
            userId: user.id,
            eventId: event.id,
            rating: input.rating,
            comment: input.comment,
          },
        });
        return feedback;
      }
      throw new TRPCError({ code: "BAD_REQUEST" });
    }),

  getFeedback: protectedProcedure
    .input(z.object({ eventId: z.string(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!event) throw new TRPCError({ code: "BAD_REQUEST" });

      const feedback = await prisma.feedback.findFirst({
        where: {
          eventId: event.id,
          userId: input.userId,
        },
      });

      return feedback;
    }),

  getFeedbacks: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!event) throw new TRPCError({ code: "BAD_REQUEST" });

      const feedbacks = await prisma.feedback.findMany({
        where: {
          eventId: event.id,
        },
        include: {
          user: true,
        },
      });

      if (!feedbacks) throw new TRPCError({ code: "BAD_REQUEST" });

      return feedbacks;
    }),
});
