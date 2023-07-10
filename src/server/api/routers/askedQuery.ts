import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const askedQueryRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ creatorProfile: z.string(), question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { creatorProfile, question } = input;
      const { prisma } = ctx;

      const creator = await prisma.user.findUnique({
        where: {
          creatorProfile: input.creatorProfile,
        },
      });

      if (!creator) throw new TRPCError({ code: "BAD_REQUEST" });

      if (creator.id === ctx.session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const audienceMember = await prisma.audienceMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          creatorId: creator.id,
        },
      });

      if (!audienceMember) {
        // if audience member doesn't exist, create one
        await prisma.audienceMember.create({
          data: {
            email: ctx.session.user.email ?? "",
            name: ctx.session.user.name ?? "",
            userId: ctx.session.user.id ?? "",
            creatorId: creator.id,
          },
        });
      }

      const query = await prisma.askedQuery.create({
        data: {
          userId: ctx.session.user.id,
          question,
          creatorProfile,
        },
      });

      return query;
    }),

  answerQuery: protectedProcedure
    .input(z.object({ id: z.string(), answer: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const query = await prisma.askedQuery.update({
        where: {
          id: input.id,
        },
        data: {
          answer: input.answer,
        },
      });

      return query;
    }),

  getOne: protectedProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const querys = await prisma.askedQuery.findFirst({
        where: {
          userId: ctx.session.user.id,
          creatorProfile: input.creatorProfile,
        },
      });
      return querys;
    }),

  getAllPending: protectedProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const querys = await prisma.askedQuery.findMany({
        where: {
          creatorProfile: input.creatorProfile,
          answer: null,
        },
        include: {
          user: true,
        },
      });

      return querys;
    }),

  getAllReplied: protectedProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const querys = await prisma.askedQuery.findMany({
        where: {
          creatorProfile: input.creatorProfile,
        },
        include: {
          user: true,
        },
      });

      return querys;
    }),

  getUserQuery: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const querys = await prisma.askedQuery.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
      },
    });

    return querys;
  }),
});
