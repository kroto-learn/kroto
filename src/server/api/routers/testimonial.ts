import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const testimonialRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ creatorProfile: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { creatorProfile, content } = input;
      const { prisma } = ctx;

      if (!ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      const testimonial = await prisma.testimonial.create({
        data: {
          userId: ctx.session.user.id,
          content,
          creatorProfile,
        },
      });

      return testimonial;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const testimonial = await prisma.testimonial.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });

      return testimonial;
    }),

  getAllUser: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const testimonials = await prisma.testimonial.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
      },
    });

    return testimonials;
  }),

  getAllCreator: publicProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ ctx, input }) => {
      const { creatorProfile } = input;
      const { prisma } = ctx;

      const testimonials = await prisma.testimonial.findMany({
        where: {
          creatorProfile,
        },
        include: {
          user: true,
        },
      });

      return testimonials;
    }),
});