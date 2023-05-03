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

      //FIXME createMany does not return created records, returning hardcode data for now
      // return audiences;
      return [
        { email: "rosekamallove@gmail.com", id: "1" },
        { email: "ysgaur9919@gmail.com", id: "2" },
        { email: "ysgaur9919@gmail.com", id: "3" },
        { email: "ysgaur9919@gmail.com", id: "4" },
        { email: "ysgaur9919@gmail.com", id: "5" },
        { email: "ysgaur9919@gmail.com", id: "6" },
        { email: "ysgaur9919@gmail.com", id: "7" },
        { email: "ysgaur9919@gmail.com", id: "8" },
        { email: "ysgaur9919@gmail.com", id: "9" },
      ];
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
