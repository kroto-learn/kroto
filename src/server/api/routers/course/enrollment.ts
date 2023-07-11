import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { TRPCError } from "@trpc/server";

import Razorpay from "razorpay";
import shortid from "shortid";
import crypto from "crypto";
import { env } from "@/env.mjs";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const enrollmentCourseRouter = createTRPCRouter({
  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.courseId },
        include: { discount: true },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!course || !user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const isDiscount =
        course?.permanentDiscount !== null ||
        (course?.discount &&
          course?.discount?.deadline?.getTime() > new Date().getTime());

      const discount =
        course?.discount &&
        course?.discount?.deadline?.getTime() > new Date().getTime()
          ? course?.discount?.price
          : course?.permanentDiscount ?? 0;

      const price = isDiscount ? discount : course?.price;

      if (price > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not a free course",
        });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      });

      const audienceMember = await prisma.audienceMember.findFirst({
        where: {
          email: user.email,
          creatorId: course.creatorId ?? "",
        },
      });

      /* Adding to audience list */
      if (!audienceMember) {
        // if audience member doesn't exist, create one
        await prisma.audienceMember.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            creatorId: course.creatorId ?? "",
            courseId: course.id,
          },
        });
      }

      return enrollment;
    }),

  createBuyCourseOrder: protectedProcedure
    .input(z.object({ courseId: z.string(), promoCode: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { courseId } = input;

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          discount: true,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!course || !user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      let promoDiscount = 0;

      const pc = await prisma.promoCode.findFirst({
        where: {
          code: input.promoCode,
          courseId: input.courseId,
        },
      });

      if (pc && pc.active) promoDiscount = pc.discountPercent;

      const isDiscount =
        course?.permanentDiscount !== null ||
        (course?.discount &&
          course?.discount?.deadline?.getTime() > new Date().getTime());

      const discount =
        course?.discount &&
        course?.discount?.deadline?.getTime() > new Date().getTime()
          ? course?.discount?.price
          : course?.permanentDiscount ?? 0;

      const course_price = isDiscount
        ? discount - (promoDiscount / 100) * discount
        : course?.price - (promoDiscount / 100) * course?.price;

      const payment_capture = 1;
      const amount = course_price * 100;
      const currency = "INR";

      const options = {
        amount: amount.toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
        notes: {
          paymentFor: "course_purchase",
          userId: user.id,
          courseId: course.id,
        },
      };

      try {
        const response = await razorpay.orders.create(options);
        return {
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Couldn't create razorpay order",
        });
      }
    }),

  verifyCoursePurchase: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_order_id: z.string(),
        razorpay_signature: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const {
        courseId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = input;

      const generated_signature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${env.RAZORPAY_KEY_SECRET}`);

      // if (generated_signature.digest("hex") !== razorpay_signature) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Invalid signature",
      //   });
      // }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          discount: true,
          creator: true,
        },
      });
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user || !course || !course.creatorId)
        throw new TRPCError({ code: "BAD_REQUEST" });

      await prisma.purchase.create({
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          creatorId: course.creatorId,
          userId: ctx.session.user.id,
        },
      });

      // Update Creator's Revenue
      let course_price = course.price;
      if (course.discount?.price) {
        course_price = course.discount.price;
      } else {
        course_price = course.permanentDiscount ?? course.price;
      }

      const paymentDataOfCreator = await prisma.payment.findFirst({
        where: {
          userId: course.creatorId,
        },
      });

      if (!paymentDataOfCreator) {
        await prisma.payment.create({
          data: {
            userId: course.creatorId,
            withdrawAmount: course_price,
          },
        });
      } else {
        await prisma.payment.update({
          where: {
            id: paymentDataOfCreator.id,
          },
          data: {
            withdrawAmount: paymentDataOfCreator.withdrawAmount + course_price,
            lifeTimeEarnings:
              paymentDataOfCreator.lifeTimeEarnings + course_price,
          },
        });
      }

      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      });

      const audienceMember = await prisma.audienceMember.findFirst({
        where: {
          email: user.email,
          creatorId: course.creatorId ?? "",
        },
      });

      /* Adding to audience list */
      if (!audienceMember) {
        // if audience member doesn't exist, create one
        await prisma.audienceMember.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            creatorId: course.creatorId ?? "",
            courseId: course.id,
          },
        });
      }
    }),

  isEnrolled: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      if (!ctx.session) return null;

      const enrolled = prisma.enrollment.findFirst({
        where: {
          userId: ctx.session.user.id,
          courseId: input.courseId,
        },
      });

      return enrolled;
    }),

  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                _count: {
                  select: {
                    chapters: true,
                  },
                },
                courseProgress: {
                  where: {
                    watchedById: ctx.session.user.id,
                  },
                  include: {
                    lastChapter: true,
                  },
                  take: 1,
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const enrollments = user?.enrollments
      .map((er) => ({
        ...er,
        course: {
          ...er.course,
          courseProgress: er.course.courseProgress[0],
        },
      }))
      .filter((er) => er.course.creatorId !== ctx.session.user.id);

    return enrollments;
  }),

  getLastLearnedCourses: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const coursesProgresses = await prisma.courseProgress.findMany({
      where: {
        watchedById: ctx.session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 2,
    });

    return coursesProgresses;
  }),
});
