import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  dailyLearningReport,
  dailyReminderNotLearned,
} from "@/server/helpers/emailHelper";

export const dailyReminderRouter = createTRPCRouter({
  sendDailyLearningReminder: publicProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;

    const currentDate = new Date();

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 7
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const users = await prisma.user.findMany();

    for (const user of users) {
      const tracks = await prisma.learnTrack.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      if (tracks.length === 0) {
        dailyReminderNotLearned({
          email: user.email,
        });
      } else {
        dailyLearningReport({
          email: user.email,
          courseId: tracks[0]?.courseId ?? "",
          chapterId: tracks[0]?.chapterId ?? "",
          minutes: tracks[0]?.minutes ?? 0,
        });
      }
    }
  }),
});
