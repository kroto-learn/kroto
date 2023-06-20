import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const trackingRouter = createTRPCRouter({
  trackLearning: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "IST" })
      );
      const day = today.getDate();
      const month = today.getMonth();
      // January =0, February = 1, ...
      const year = today.getFullYear();
      const weekday = today.getDay();
      // Sunday = 0, Monday = 1, so on...

      const trackExists = await prisma.learnTrack.findFirst({
        where: {
          userId: input.userId,
          courseId: input.courseId,
          chapterId: input.chapterId,
          day,
          month,
          year,
        },
      });

      if (trackExists) {
        const updatedTrack = await prisma.learnTrack.update({
          where: {
            id: trackExists.id,
          },
          data: {
            minutes: trackExists.minutes + 1,
          },
        });

        return updatedTrack;
      }

      const newTrack = await prisma.learnTrack.create({
        data: {
          userId: input.userId,
          courseId: input.courseId,
          chapterId: input.chapterId,
          day,
          month,
          year,
          weekday,
        },
      });

      return newTrack;
    }),

  getPastWeek: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const minutesStudiedInLastWeek: { date: Date; minutes: number }[] = [];

    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "IST" })
    );
    for (let i = 6; i >= 0; i--) {
      const lastIthDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);

      // Query documents created in the last 7 days
      const learnTracks = await prisma.learnTrack.findMany({
        where: {
          userId: ctx.session.user.id,
          day: lastIthDate.getDate(),
          month: lastIthDate.getMonth(),
          year: lastIthDate.getFullYear(),
        },
      });

      const minutes = learnTracks.reduce((total, current) => {
        return total + current.minutes;
      }, 0);

      minutesStudiedInLastWeek.push({ date: lastIthDate, minutes });
    }

    return minutesStudiedInLastWeek;
  }),
});