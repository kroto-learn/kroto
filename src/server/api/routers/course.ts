import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getPlaylistDataService,
  searchYoutubePlaylistsService,
} from "@/server/services/youtube";

export const courseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
          courseBlockVideos: true,
          courseBlockMds: true,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      const courseBlocks = [
        ...course.courseBlockVideos,
        ...course.courseBlockMds,
      ];

      courseBlocks.sort((a, b) => a.position - b.position);

      return { ...course, courseBlocks };
    }),

  // Used for RouterOutputs don't remove.
  getCourse: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      const courseBlockVideos = await prisma.courseBlockVideo.findMany({
        where: { courseId: course.id },
      });

      const courseBlockMds = await prisma.courseBlockMd.findMany({
        where: { courseId: course.id },
      });

      const courseBlocks = [...courseBlockVideos, ...courseBlockMds];

      courseBlocks.sort((a, b) => a.position - b.position);

      return { ...course, courseBlocks };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const coursesP = (
      await prisma.course.findMany({
        where: {
          creatorId: ctx.session.user.id,
        },
      })
    ).map(async (course) => {
      const videos = await prisma.courseBlockVideo.count({
        where: { courseId: course.id },
      });
      const mds = await prisma.courseBlockMd.count({
        where: { courseId: course.id },
      });
      const blocks = videos + mds;
      return { ...course, blocks };
    });
    const coursesWithCount = await Promise.all(coursesP);

    return coursesWithCount;
  }),

  searchYoutubePlaylists: protectedProcedure
    .input(z.object({ searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.token)
        return new TRPCError({ code: "BAD_REQUEST" });

      const playlists = await searchYoutubePlaylistsService({
        searchQuery: input.searchQuery,
        accessToken: ctx.session.user.token,
      });

      return playlists;
    }),

  getYoutubePlaylist: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      const playlist = await getPlaylistDataService(input.playlistId);

      return playlist;
    }),

  // create: protectedProcedure
  //   .input(createFormSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const { prisma } = ctx;

      const playlists = await searchYoutubePlaylistsService({
        searchQuery: input.searchQuery,
        accessToken: ctx.session.user.token,
      });

      return playlists;
    }),

  getYoutubePlaylist: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      const playlist = await getPlaylistDataService(input.playlistId);

      return playlist;
    }),

  import: protectedProcedure
    .input(importCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnail: input.thumbnail,
          creatorId: ctx.session.user.id,
        },
      });

      const courseBlockVideos = await prisma.courseBlockVideo.createMany({
        data: input.courseBlockVideos.map((cb, position) => ({
          ...cb,
          courseId: course.id,
          creatorId: ctx.session.user.id,
          position,
        })),
      });

      // const ogImageRes = await axios({
      //   url: OG_URL,
      //   responseType: "arraybuffer",
      //   params: {
      //     title: input.title,
      //     datetime: input.datetime.getTime(),
      //     host: ctx.session.user.name ?? "",
      //   },
      // });

      // const ogImage = await ogImageUpload(
      //   ogImageRes.data as AWS.S3.Body,
      //   event.id,
      //   "event"
      // );

      // const updatedEvent = await prisma.event.update({
      //   where: {
      //     id: event.id,
      //   },
      //   data: {
      //     ogImage,
      //   },
      // });

      return { ...course, courseBlockVideos };
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      await prisma.courseBlockVideo.deleteMany({
        where: {
          courseId: input.id,
        },
      });

      await prisma.courseBlockMd.deleteMany({
        where: {
          courseId: input.id,
        },
      });

      const course = await prisma.course.delete({
        where: {
          id: input.id,
        },
      });

      return course;
    }),
});
