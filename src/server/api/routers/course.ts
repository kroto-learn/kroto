import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        },
      });

      return course;
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
          courseBlockMds: true,
          courseBlockVideos: true,
        },
      });

      if (!course) return new TRPCError({ code: "NOT_FOUND" });

      const courseBlocks = [
        ...course.courseBlockMds,
        ...course.courseBlockVideos,
      ];

      courseBlocks.sort((a, b) => a.index - b.index);

      return { ...course, courseBlocks };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const courses = await prisma.course.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    return courses;
  }),

  // create: protectedProcedure
  //   .input(createFormSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const { prisma } = ctx;

  //     if (!input) return new TRPCError({ code: "BAD_REQUEST" });

  //     const event = await prisma.event.create({
  //       data: {
  //         title: input.title,
  //         description: input.description,
  //         datetime: input.datetime,
  //         endTime: input.endTime,
  //         eventUrl: input.eventUrl ?? "",
  //         eventLocation: input.eventLocation ?? "",
  //         eventType: input.eventType,
  //         // duration: input.duration,

  //         creatorId: ctx.session.user.id,
  //       },
  //     });

  //     const thumbnail = await imageUpload(input.thumbnail, event.id, "event");

  //     /* Don't use axios, make the api end point a function,
  //      * and call it if needed from /pages/api/og and here we
  //      * can just use the function.
  //      */
  //     console.log("NEXT_AUTH_URL", NEXTAUTH_URL);
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
  //       event.id,
  //       "event"
  //     );

  //     const updatedEvent = await prisma.event.update({
  //       where: {
  //         id: event.id,
  //       },
  //       data: {
  //         thumbnail,
  //         ogImage,
  //       },
  //     });

  //     return updatedEvent;
  //   }),

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

  // delete: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { prisma } = ctx;

  //     const event = await prisma.event.delete({
  //       where: {
  //         id: input.id,
  //       },
  //     });

  //     return event;
  //   }),
});
