import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { AccountType } from "@prisma/client";

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

  getPurchases: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const purchases = await prisma.purchase.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
      include: {
        user: true,
      },
    });

    return purchases;
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
        accountType: z.nativeEnum(AccountType),
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
          accountType: input.accountType,
          ifscCode: input.ifscCode,
        },
        update: {
          accountName: input.accountName,
          accountNumber: input.accountNumber,
          accountType: input.accountType,
          ifscCode: input.ifscCode,
        },
      });

      return bankDetails;
    }),
});
