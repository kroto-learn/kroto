import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const creatorRouter = createTRPCRouter({
  createProfile: protectedProcedure
    .input(
      z.object({
        creatorProfile: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { creatorProfile } = input;

      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.isCreator) return "User is already a creator";

      const updateUser = prisma.user
        .update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            creatorProfile: creatorProfile,
            isCreator: true,
          },
        })
        .catch((err: Error) => {
          return err.message;
        })
        .then(() => {
          "Successfully Created Profile";
        });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        creatorProfile: z.string(),
        bio: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { bio, name, creatorProfile } = input;

      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          creatorProfile: creatorProfile,
          bio: bio,
          name: name,
        },
      });

      return updatedUser;
    }),
});
