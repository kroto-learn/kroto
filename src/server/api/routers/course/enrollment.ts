import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { TRPCError } from "@trpc/server";

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

      if (!course || !user) return new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === user.id)
        return new TRPCError({ code: "BAD_REQUEST" });

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

      // const creator = await prisma.user.findUnique({
      //   where: {
      //     id: course.creatorId,
      //   },
      // });

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
