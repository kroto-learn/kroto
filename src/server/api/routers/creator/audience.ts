import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const audienceRouter = createTRPCRouter({
  getAudienceMembers: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const audienceMembers = await prisma.audienceMember.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    const audienceUsers = await prisma.user.findMany({
      where: {
        id: { in: audienceMembers.map((a) => a.userId) },
      },
    });

    return audienceUsers;
  }),

  importAudience: protectedProcedure
    .input(z.object({ email: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const audiences = await prisma.importedAudieceMember.createMany({
        data: input.email.map((e) => ({
          email: e,
          userId: ctx.session.user.id,
        })),
        skipDuplicates: true,
      });

      return audiences;
    }),

  getImportedAudience: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const importedAudience = await prisma.importedAudieceMember.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return importedAudience;
  }),
});
