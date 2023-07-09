import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const courseChapterRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const chapter = await prisma.chapter.findUnique({
        where: {
          id: input.id,
        },
        include: {
          course: true,
          chapterProgress: {
            where: { watchedById: ctx.session.user.id },
            take: 1,
          },
        },
      });

      if (!chapter) throw new TRPCError({ code: "NOT_FOUND" });

      return { ...chapter, chapterProgress: chapter.chapterProgress[0] };
    }),

  updateChapterProgress: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
        videoProgress: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const chapterProgress = await prisma.chapterProgress.findFirst({
        where: {
          watchedById: ctx.session.user.id,
          chapterId: input.chapterId,
        },
      });

      if (chapterProgress) {
        const updatedChapterProgress = await prisma.chapterProgress.update({
          where: {
            id: chapterProgress.id,
          },
          data: {
            videoProgress: input.videoProgress,
          },
        });
        return updatedChapterProgress;
      } else {
        try {
          const newChapterProgress = await prisma.chapterProgress.create({
            data: {
              watchedById: ctx.session.user.id,
              chapterId: input.chapterId,
            },
          });
          return newChapterProgress;
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    }),

  markWatched: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const chapterProgress = await prisma.chapterProgress.findFirst({
        where: {
          watchedById: ctx.session.user.id,
          chapterId: input.chapterId,
        },
      });

      if (chapterProgress) {
        const updatedCP = await prisma.chapterProgress.update({
          where: {
            id: chapterProgress.id,
          },
          data: {
            watched: true,
            videoProgress: 0,
          },
        });

        return updatedCP;
      } else {
        const newCP = await prisma.chapterProgress.create({
          data: {
            watchedById: ctx.session.user.id,
            chapterId: input.chapterId,
            watched: true,
          },
        });

        return newCP;
      }
    }),

  clearWatched: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const chapterProgress = await prisma.chapterProgress.findFirst({
        where: {
          watchedById: ctx.session.user.id,
          chapterId: input.chapterId,
        },
      });

      if (chapterProgress)
        await prisma.chapterProgress.update({
          where: {
            id: chapterProgress.id,
          },
          data: {
            watched: false,
          },
        });

      return chapterProgress;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["TEXT", "YTVIDEO", "VIDEO"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.chapter.delete({
        where: {
          id: input.id,
        },
      });

      return course;
    }),
});
