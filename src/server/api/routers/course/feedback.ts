import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const courseFeedbacksRouter = createTRPCRouter({
  addFeedback: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.courseId },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!course || !user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === ctx.session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const isFeedback = await prisma.feedback.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });

      if (!isFeedback) {
        const feedback = await prisma.feedback.create({
          data: {
            userId: user.id,
            courseId: course.id,
            rating: input.rating,
            comment: input.comment,
          },
        });
        return feedback;
      }
      throw new TRPCError({ code: "BAD_REQUEST" });
    }),

  getFeedback: protectedProcedure
    .input(z.object({ courseId: z.string(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

      const feedback = await prisma.feedback.findFirst({
        where: {
          courseId: course.id,
          userId: input.userId,
        },
      });

      return feedback;
    }),

  getFeedbacks: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

      const feedbacks = await prisma.feedback.findMany({
        where: {
          courseId: course.id,
        },
        include: {
          user: true,
        },
      });

      if (!feedbacks) throw new TRPCError({ code: "BAD_REQUEST" });

      return feedbacks;
    }),
});
