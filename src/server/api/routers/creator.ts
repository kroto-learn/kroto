import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const creatorRouter = createTRPCRouter({
  getPublicProfile: publicProcedure
    .input(z.object({ creatorProfile: z.string() }))
    .query(async ({ input, ctx }) => {
      const { creatorProfile } = input;
      const { prisma } = ctx;

      const creator = await prisma.user.findUnique({
        where: {
          creatorProfile: creatorProfile,
        },
      });

      const socialLinks = await prisma.socialLink.findMany({
        where: { creatorId: creator?.id },
      });

      const events = await prisma.event.findMany({
        where: { creatorId: creator?.id },
      });

      return { ...creator, socialLinks: socialLinks, events };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    const socialLinks = await prisma.socialLink.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    return { ...user, socialLinks: socialLinks };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        creatorProfile: z.string(),
        bio: z.string(),
        name: z.string(),
        socialLinks: z
          .object({
            type: z.string(),
            url: z.string(),
          })
          .array()
          .optional(),
        topmateUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { bio, name, creatorProfile, socialLinks } = input;

      const createSocialLinks = socialLinks?.map((link) => {
        return { ...link, creatorId: ctx.session.user.id };
      });

      const createdSocialLinks = await prisma.socialLink.createMany({
        data: createSocialLinks ?? [],
      });

      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          isCreator: true,
          creatorProfile: creatorProfile,
          bio: bio,
          name: name,
        },
      });

      return { ...updatedUser, socialLinks: createdSocialLinks };
    }),
});
