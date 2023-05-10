import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getVideoDataService } from "@/server/services/youtube";

export const courseChapterRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const [chapterText, chapterVideo] = await Promise.all([
        prisma.courseBlockMd.findUnique({
          where: {
            id: input.id,
          },
          include: {
            creator: true,
            course: true,
          },
        }),
        prisma.courseBlockVideo.findUnique({
          where: {
            id: input.id,
          },
          include: {
            creator: true,
            course: true,
          },
        }),
      ]);

      if (chapterVideo) {
        if (chapterVideo.ytId)
          return {
            ...chapterVideo,
            description: (await getVideoDataService(chapterVideo.ytId))
              ?.description,
          };
        return chapterVideo;
      } else return chapterText;
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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["TEXT", "YTVIDEO", "VIDEO"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      if (input.type === "TEXT") {
        const course = await prisma.courseBlockMd.delete({
          where: {
            id: input.id,
          },
        });

        return course;
      }

      const course = await prisma.courseBlockVideo.delete({
        where: {
          id: input.id,
        },
      });

      return course;
    }),
});
