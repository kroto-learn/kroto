import { string, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

interface SocialLink {
  type: string;
  url: string;
  creatorId: string;
}

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

  createSocialLink: protectedProcedure
    .input(z.object({ type: z.string(), url: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const socialLink = await prisma.socialLink.create({
        data: {
          type: input.type,
          url: input.url,
          creatorId: ctx.session.user.id,
        },
      });

      return socialLink;
    }),

  updateSocialLink: protectedProcedure
    .input(z.object({ id: z.string(), type: z.string(), url: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const socialLink = await prisma.socialLink.update({
        where: {
          id: input.id,
        },
        data: {
          type: input.type,
          url: input.url,
          creatorId: ctx.session.user.id,
        },
      });

      return socialLink;
    }),

  deleteSocialLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const socialLink = await prisma.socialLink.delete({
        where: {
          id: input.id,
        },
      });

      return socialLink;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        creatorProfile: z.string(),
        bio: z.string(),
        name: z.string(),
        topmateUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { bio, name, topmateUrl, creatorProfile } = input;

      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          isCreator: true,
          creatorProfile: creatorProfile,
          bio: bio,
          name: name,
          topmateUrl,
        },
      });

      const socialLinks = await prisma.socialLink.findMany({
        where: {
          creatorId: ctx.session.user.id,
        },
      });

      // return { ...updatedUser, socialLinks: createdSocialLinks };
      return { ...updatedUser, socialLinks };
    }),
});
