import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const emailRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const emails = await prisma.email.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
      include: {
        recipients: true,
      },
    });

    return emails;
  }),

  create: protectedProcedure
    .input(
      z.object({
        subject: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const email = await prisma.email.create({
        data: {
          subject: input.subject,
          body: input.body,
          from: ctx.session.user.email ?? "",
          sent: false,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return email;
    }),

  update: protectedProcedure
    .input(
      z.object({
        emailUniqueId: z.string(),
        subject: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const email = await prisma.email.update({
        where: {
          id: input.emailUniqueId,
        },
        data: {
          subject: input.subject,
          body: input.body,
          from: ctx.session.user.email ?? "",
          sent: false,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return email;
    }),

  addRecipients: protectedProcedure
    .input(z.object({ emailUniqueId: z.string(), email: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const email = await prisma.email.findUnique({
        where: {
          id: input.emailUniqueId,
        },
      });

      if (!email) return new TRPCError({ code: "BAD_REQUEST" });

      const recipients = await prisma.recipient.createMany({
        data: input.email.map((e) => ({
          emailId: e,
          emailModelId: email.id,
        })),
        skipDuplicates: true,
      });

      return recipients;
    }),

  importFromAudience: protectedProcedure
    .input(z.object({ emailUniqueId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const audienceMemebers = await prisma.audienceMember.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const recipients = await prisma.recipient.createMany({
        data: audienceMemebers.map((a) => ({
          emailId: a.email,
          emailModelId: input.emailUniqueId,
        })),
        skipDuplicates: true,
      });

      return recipients;
    }),

  importFromImportedAudience: protectedProcedure
    .input(z.object({ emailUniqueId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const audienceMemebers = await prisma.importedAudieceMember.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const recipients = await prisma.recipient.createMany({
        data: audienceMemebers.map((a) => ({
          emailId: a.email,
          emailModelId: input.emailUniqueId,
        })),
        skipDuplicates: true,
      });

      return recipients;
    }),

  delete: protectedProcedure
    .input(z.object({ emailUniqueId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const email = await prisma.email.delete({
        where: {
          id: input.emailUniqueId,
        },
      });

      return email;
    }),
});
