import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  dailyLearningReport,
  dailyReminderNotLearned,
} from "@/server/helpers/emailHelper";

export const dailyReminderRouter = createTRPCRouter({
  sendDailyLearningReminder: publicProcedure.query(async ({ ctx }) => {
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

    console.log("send reminder & report crone on ", currentDate.toDateString());

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
        console.log(user.email, "not studied");

        if (user.courseProgress[0]?.courseId) {
          console.log(user.email, "sending reminder");
          void dailyReminderNotLearned({
            name: user.name,
            email: user.email,
            courseId: user.courseProgress[0]?.courseId ?? "",
            courseName: user.courseProgress[0]?.course?.title ?? "",
          });
        } else {
          console.log(user.email, "no previous record so skipping");
        }
      } else {
        console.log(user.email, "studied");
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

        console.log(user.email, "sending report");

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

  updateDailyStreak: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const users = await prisma.user.findMany();

    const currentDate = new Date();

    console.log("update streak crone on ", currentDate.toDateString());

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

      if (tracks.length > 0) {
        console.log(user.email, "should increase streak");
        if (streak) {
          console.log(user.email, "streak exists");

          if (streak.updatedAt?.getDate() !== new Date().getDate()) {
            const data: { days: number; start: Date | undefined } = {
              days: streak.days + 1,
              start: new Date(),
            };

            if (streak.days > 0) delete data.start;

            await prisma.dailyStreak.update({
              where: { userId: user.id },
              data,
            });

            console.log(user.email, "streak increased");
          } else {
            console.log(user.email, "todays streak already given so skipping");
          }
        } else {
          await prisma.dailyStreak.create({
            data: {
              userId: user.id,
              start: new Date(),
            },
          });
          console.log(user.email, "streak created");
        }
      } else {
        console.log(user.email, "should clear streak");

        if (streak) {
          console.log(user.email, "streak exists");
          await prisma.dailyStreak.update({
            where: { userId: user.id },
            data: {
              days: 0,
            },
          });
          console.log(user.email, "streak cleared");
        } else {
          console.log(user.email, "skip");
        }
      }
    }
  }),
});
