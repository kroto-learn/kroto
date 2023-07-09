import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createPromoCodeSchema } from "@/components/CreatePromoCodeModal";
import { z } from "zod";
import { updatePromoCodeSchema } from "@/components/UpdatePromoCodeModal";

export const promoCodeCourseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPromoCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.courseId },
      });

      if (!course || course.creatorId !== session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const pc = await prisma.promoCode.create({
        data: {
          code: input.code,
          discountPercent: parseInt(input.discountPercent),
          courseId: input.courseId,
          active: true,
        },
      });

      return pc;
    }),
  editActive: protectedProcedure
    .input(
      z.object({
        active: z.boolean(),
        promoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const pc = await prisma.promoCode.findUnique({
        where: { id: input.promoId },
        include: {
          course: true,
        },
      });

      if (!pc || pc.course.creatorId !== session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const updatePc = await prisma.promoCode.update({
        where: {
          id: input.promoId,
        },
        data: {
          active: input.active,
        },
      });

      return updatePc;
    }),

  edit: protectedProcedure
    .input(updatePromoCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const pc = await prisma.promoCode.findUnique({
        where: { id: input.promoId },
        include: {
          course: true,
        },
      });

      if (!pc || pc.course.creatorId !== session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const updatePc = await prisma.promoCode.update({
        where: {
          id: input.promoId,
        },
        data: {
          discountPercent: parseInt(input.discountPercent),
        },
      });

      return updatePc;
    }),

  getAll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.courseId },
      });

      if (!course || course.creatorId !== session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const pcs = await prisma.promoCode.findMany({
        where: {
          courseId: input.courseId,
        },
      });

      return pcs;
    }),

  apply: protectedProcedure
    .input(z.object({ courseId: z.string(), code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const pc = await prisma.promoCode.findFirst({
        where: {
          code: input.code,
          courseId: input.courseId,
        },
      });

      if (pc && pc.active) return pc.discountPercent;
      else return undefined;
    }),

  delete: protectedProcedure
    .input(z.object({ promoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

      const pc = await prisma.promoCode.findUnique({
        where: { id: input.promoId },
        include: {
          course: true,
        },
      });

      if (!pc || pc.course.creatorId !== session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const deletePc = await prisma.promoCode.delete({
        where: {
          id: input.promoId,
        },
      });

      return deletePc;
    }),
});
