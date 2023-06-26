import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const tagsCourseRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(z.string().min(3))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const tag = await prisma.tag.create({
        data: {
          title: input,
        },
      });

      return tag;
    }),

  searchTags: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const tags = await prisma.tag.findMany({
        where: {
          title: {
            contains: input,
          },
        },
      });

      return tags;
    }),

  deleteTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const tag = await prisma.tag.delete({
        where: {
          id: input,
        },
      });

      return tag;
    }),
});
