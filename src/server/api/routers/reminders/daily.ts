import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  dailyLearningReport,
  dailyReminderNotLearned,
} from "@/server/helpers/emailHelper";

export const dailyReminderRouter = createTRPCRouter({
  sendDailyLearningReminder: publicProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;

    const currentDate = new Date();

    const yesterdayStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    const users = await prisma.user.findMany({
      include: {
        courseProgress: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            course: true,
          },
          take: 1,
        },
        learningStreak: true,
      },
    });

    for (const user of users) {
      const tracks = await prisma.learnTrack.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          course: true,
        },
      });

      if (tracks.length === 0) {
        void dailyReminderNotLearned({
          name: user.name,
          email: user.email,
          courseId: user.courseProgress[0]?.courseId ?? "",
          courseName: user.courseProgress[0]?.course?.title ?? "",
        });
      } else {
        const yesterdayTracks = await prisma.learnTrack.findMany({
          where: {
            userId: user.id,
            createdAt: {
              gte: yesterdayStartDate,
              lt: startDate,
            },
          },
          include: {
            course: true,
          },
        });

        const prevMinutes = yesterdayTracks.reduce((total, current) => {
          return total + current.minutes;
        }, 0);

        const minutes = tracks.reduce((total, current) => {
          return total + current.minutes;
        }, 0);

        void dailyLearningReport({
          name: user.name,
          email: user.email,
          courseId: tracks[0]?.courseId ?? "",
          courseName: tracks[0]?.course?.title ?? "",
          chsWatched: tracks.length,
          prevMinutes,
          streak: user?.learningStreak?.days ?? 1,
          minutes,
        });
      }
    }
  }),

  updateDailyStreak: publicProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;

    const users = await prisma.user.findMany();

    const currentDate = new Date();

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    for (const user of users) {
      const tracks = await prisma.learnTrack.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          course: true,
        },
      });

      const streak = await prisma.dailyStreak.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (tracks.length === 0) {
        if (streak) {
          const data: { days: number; start: Date | undefined } = {
            days: streak.days + 1,
            start: new Date(),
          };

          if (streak.days === 0) delete data.start;
          await prisma.dailyStreak.update({
            where: { userId: user.id },
            data,
          });
        } else
          await prisma.dailyStreak.create({
            data: {
              userId: user.id,
            },
          });
      } else {
        if (streak)
          await prisma.dailyStreak.update({
            where: { userId: user.id },
            data: {
              days: 0,
            },
          });
      }
    }
  }),
});
