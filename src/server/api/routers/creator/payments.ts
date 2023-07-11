import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymetnRouter = createTRPCRouter({
  getPaymentDetails: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const paymentDetails = await prisma.payment.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return paymentDetails;
  }),

  getBankDetails: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const bankDetails = await prisma.bankDetails.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return bankDetails;
  }),

  updateBankDetails: protectedProcedure
    .input(
      z.object({
        accountName: z.string(),
        accountNumber: z.string(),
        ifscCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const bankDetails = await prisma.bankDetails.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        create: {
          userId: ctx.session.user.id,
          accountName: input.accountName,
          accountNumber: input.accountNumber,
          ifscCode: input.ifscCode,
        },
        update: {
          accountName: input.accountName,
          accountNumber: input.accountNumber,
          ifscCode: input.ifscCode,
        },
      });

      return bankDetails;
    }),
});
