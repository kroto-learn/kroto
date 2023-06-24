import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const askedQueryRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ creatorProfile: z.string(), question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { creatorProfile, question } = input;
      const { prisma } = ctx;

      if (!ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      const creator = await prisma.user.findUnique({
        where: {
          creatorProfile: input.creatorProfile,
        },
      });

      if (!creator) throw new TRPCError({ code: "BAD_REQUEST" });

      if (creator.id === ctx.session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const querys = await prisma.askedQuery.create({
        data: {
          userId: ctx.session.user.id,
          question,
          creatorProfile,
        },
      });

      return querys;
    }),

  update: protectedProcedure
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

  getAllUser: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const query = await prisma.askedQuery.findMany({
      where: {
        userId: ctx.session.user.id,
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

  getAllCreator: publicProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ ctx, input }) => {
      const { creatorProfile } = input;
      const { prisma } = ctx;

      const querys = await prisma.askedQuery.findMany({
       where:{
        creatorProfile
       },
       include:{
        user: true
       }
      
      });

      return querys;
    }),

  getAllCreatorProtected: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user || !user.isCreator || !user.creatorProfile)
      throw new TRPCError({ code: "BAD_REQUEST" });

    const querys = await prisma.askedQuery.findMany({
      where: {
        creatorProfile: user.creatorProfile,
      },
      // include: {
      //  user: true
      // },
    });

    return querys;
  }),
});
