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

        const yesterdayMinutes = yesterdayTracks.reduce((total, current) => {
          return total + current.minutes;
        }, 0);

        const minutes = tracks.reduce((total, current) => {
          return total + current.minutes;
        }, 0);

        const diff = yesterdayMinutes
          ? ((minutes - yesterdayMinutes) / yesterdayMinutes) * 100
          : 100;

        // TODO: implement streak calculation

        // const allTracks = await prisma.learnTrack.findMany({
        //   where: {
        //     userId: user.id,
        //   },
        //   orderBy: {
        //     createdAt: "desc",
        //   },
        // });

        // let streak = 0;
        // let lastDate = new Date();

        // for (const track in allTracks) {
        //   if (allTracks[track].createdAt.getDate() === lastDate.getDate()) {
        //     streak++;
        //   } else {
        //     streak = 0;
        //   }

        //   lastDate = allTracks[track].createdAt;

        // }

        void dailyLearningReport({
          name: user.name,
          email: user.email,
          courseId: tracks[0]?.courseId ?? "",
          courseName: tracks[0]?.course?.title ?? "",
          chsWatched: tracks.length,
          moreLearned: diff >= 0 ? `${Math.abs(diff)}% more` : "",
          lessLearned: diff < 0 ? `${diff}% less` : "",
          minutes,
        });
      }
    }
  }),
});
