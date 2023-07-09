import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { TRPCError } from "@trpc/server";

import Razorpay from "razorpay";
import shortid from "shortid";
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
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!course || !user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (course.price > 0) {
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

      // TODO: send course enrollment confirmation
      // try {
      //   await sendRegistrationConfirmation(
      //     course,
      //     creator,
      //     user.email,
      //     user.name
      //   );
      // } catch (e) {
      //   console.log(e);
      // }

      return enrollment;
    }),

  createBuyCourseOrder: protectedProcedure
    .input(z.object({ courseId: z.string() }))
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

      let course_price = course.price;
      if (course.discount?.price) {
        course_price = course.discount.price;
      } else {
        course_price = course.permanentDiscount ?? course.price;
      }

      const payment_capture = 1;
      const amount = course_price * 100;
      const currency = "INR";

      const options = {
        amount: amount.toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
        notes: {
          // These notes will be added to your transaction. So you can search it within their dashboard.
          // Also, it's included in webhooks as well. So you can automate it.
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

  validateBuyCourseOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(() => {
      return null;
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
