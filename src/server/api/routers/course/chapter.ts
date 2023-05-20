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
          creator: true,
          course: true,
          chapterProgress: {
            where: { watchedById: ctx.session.user.id },
            take: 1,
          },
        },
      });

      if (!chapter) return new TRPCError({ code: "NOT_FOUND" });

      return { ...chapter, chapterProgress: chapter.chapterProgress[0] };
    }),

  // update: protectedProcedure
  //   .input(createFormSchema.and(z.object({ id: z.string() })))
  //   .mutation(async ({ input, ctx }) => {
  //     const { prisma } = ctx;

  //     if (!input) return new TRPCError({ code: "BAD_REQUEST" });

  //     const checkIsCreator = await prisma.event.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //     });

  //     if (!checkIsCreator)
  //       return new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "Event doesn't exist",
  //       });

  //     if (checkIsCreator.creatorId !== ctx.session.user.id)
  //       return new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "You didn't create this event",
  //       });

  //     let thumbnail = input.thumbnail;
  //     if (isBase64(input.thumbnail, { allowMime: true }))
  //       thumbnail = await imageUpload(input.thumbnail, input.id, "event");

  //     const ogImageRes = await axios({
  //       url: OG_URL,
  //       responseType: "arraybuffer",
  //       params: {
  //         title: input.title,
  //         datetime: input.datetime.getTime(),
  //         host: ctx.session.user.name ?? "",
  //       },
  //     });

  //     const ogImage = await ogImageUpload(
  //       ogImageRes.data as AWS.S3.Body,
  //       input.id,
  //       "event"
  //     );

  //     const event = await prisma.event.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: {
  //         title: input.title,
  //         description: input.description,
  //         datetime: input.datetime,
  //         eventUrl: input.eventUrl ?? "",
  //         eventLocation: input.eventLocation ?? "",
  //         eventType: input.eventType,
  //         thumbnail: thumbnail,
  //         ogImage,
  //         endTime: input.endTime,

  //         creatorId: ctx.session.user.id,
  //       },
  //     });

  //     return event;
  //   }),

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

  deleteChapterProgress: protectedProcedure
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
        await prisma.chapterProgress.delete({
          where: {
            id: chapterProgress.id,
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
