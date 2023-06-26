import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { createCategoryFormSchema } from "@/pages/admin/dashboard/categories";

export const categoriesCourseRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategoryFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const catgs = await prisma.category.create({
        data: {
          title: input.title,
        },
      });

      return catgs;
    }),

  getCategories: publicProcedure.query(async ({ ctx, input }) => {
    const { prisma } = ctx;

    const catgs = await prisma.category.findMany({
      where: {
        title: {
          contains: input,
        },
      },
    });

    return catgs;
  }),
});
