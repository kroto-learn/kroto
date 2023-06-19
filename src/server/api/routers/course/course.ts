import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getPlaylistDataAdminService,
  getPlaylistDataService,
  searchYoutubePlaylistsAdminService,
  searchYoutubePlaylistsService,
} from "@/server/services/youtube";
import { importCourseFormSchema } from "@/pages/course/import";
import { generateStaticCourseOgImage } from "@/server/services/og";
import { env } from "@/env.mjs";
import { ogImageUpload } from "@/server/helpers/s3";
import { settingsFormSchema } from "../../../../pages/creator/dashboard/course/[id]/settings";
import { adminImportCourseFormSchema } from "@/pages/course/admin-import";
import { isAdmin } from "@/server/helpers/admin";
import { createCategoryFormSchema } from "@/pages/admin/dashboard/categories";
const { NEXTAUTH_URL } = env;

const OG_URL = `${
  process.env.VERCEL ? "https://" : ""
}${NEXTAUTH_URL}/api/og/course`;

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
          chapters: {
            include: {
              chapterProgress: {
                where: { watchedById: ctx.session.user.id },
                take: 1,
              },
            },
          },
          courseProgress: {
            where: { watchedById: ctx.session.user.id },
            take: 1,
            include: {
              lastChapterProgress: true,
            },
          },
          enrollments: {
            include: {
              user: true,
            },
          },
          tags: true,
          category: true,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      if (
        course.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        return new TRPCError({ code: "BAD_REQUEST" });

      const courseProgress = course.courseProgress[0];

      const chapters = course.chapters.map((chapter) => ({
        ...chapter,
        chapterProgress: chapter.chapterProgress[0],
      }));

      chapters.sort((a, b) => a.position - b.position);

      return { ...course, chapters, courseProgress };
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
          chapters: true,
          tags: true,
          category: true,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      const chapters = course.chapters;

      chapters.sort((a, b) => a.position - b.position);

      const previewChapter = chapters[0];

      // TODO: exclude ytId and videoUrl from chapters
      return {
        ...course,
        previewChapter,
      };
    }),

  getAll: protectedProcedure
    .input(z.object({ searchQuery: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const courses = await prisma.course.findMany({
        where: {
          creatorId: ctx.session.user.id,
          title: {
            contains: input?.searchQuery ?? "",
          },
        },
        include: {
          _count: {
            select: {
              chapters: true,
            },
          },
          tags: true,
          category: true,
        },
      });

      return courses;
    }),

  getAllAdmin: protectedProcedure
    .input(z.object({ searchQuery: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      if (!isAdmin(ctx.session.user.email ?? ""))
        return new TRPCError({ code: "BAD_REQUEST" });

      const myCourses = await prisma.course.findMany({
        where: {
          creatorId: ctx.session.user.id,
          title: {
            contains: input?.searchQuery ?? "",
          },
        },
        include: {
          _count: {
            select: {
              chapters: true,
            },
          },
          tags: true,
          category: true,
        },
      });

      const unclaimedCourses = await prisma.course.findMany({
        where: {
          creatorId: null,
          title: {
            startsWith: input?.searchQuery ?? "",
          },
        },
        include: {
          _count: {
            select: {
              chapters: true,
            },
          },
        },
      });

      return [...myCourses, ...unclaimedCourses];
    }),

  searchYoutubePlaylists: protectedProcedure
    .input(z.object({ searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.token)
        return new TRPCError({ code: "BAD_REQUEST" });

      const playlists = await searchYoutubePlaylistsService({
        searchQuery: input.searchQuery,
        accessToken: ctx.session.user.token ?? "",
      });

      return playlists;
    }),

  searchYoutubePlaylistsAdmin: protectedProcedure
    .input(z.object({ searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.token)
        return new TRPCError({ code: "BAD_REQUEST" });

      if (!isAdmin(ctx.session.user.email as string))
        return new TRPCError({ code: "BAD_REQUEST" });

      const playlists = await searchYoutubePlaylistsAdminService({
        searchQuery: input.searchQuery,
      });

      return playlists;
    }),

  getYoutubePlaylist: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      const playlist = await getPlaylistDataService(input.playlistId);

      return playlist;
    }),

  getYoutubePlaylistAdmin: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      console.log("trpc router reached!");
      const playlist = await getPlaylistDataAdminService(input.playlistId);

      return playlist;
    }),

  import: protectedProcedure
    .input(importCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      const existingCourse = await prisma.course.findFirst({
        where: { ytId: input.ytId },
      });

      if (existingCourse) return new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnail: input.thumbnail,
          creatorId: ctx.session.user.id,
          ytId: input.ytId,
          price: parseInt(input.price),
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          categoryId: input?.category?.id,
        },
      });

      const chapters = await Promise.all(
        input.chapters.map(async (cb, position) => {
          return await prisma.chapter.create({
            data: {
              ...cb,
              courseId: course.id,
              position,
            },
          });
        })
      );

      const ogImageRes = await generateStaticCourseOgImage({
        ogUrl: OG_URL,
        title: course.title,
        creatorName: ctx.session.user.name ?? "",
        chapters: chapters.length,
        thumbnail: course.thumbnail ?? "",
      });

      const ogImage = ogImageRes
        ? await ogImageUpload(
            ogImageRes.data as AWS.S3.Body,
            course.id,
            "course"
          )
        : undefined;

      const updatedCourse = await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          ogImage,
        },
        include: {
          creator: true,
        },
      });

      return { ...updatedCourse, chapters };
    }),

  adminImport: protectedProcedure
    .input(adminImportCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) return new TRPCError({ code: "BAD_REQUEST" });

      if (!isAdmin(ctx.session.user.email ?? ""))
        return new TRPCError({ code: "BAD_REQUEST" });

      const existingCourse = await prisma.course.findFirst({
        where: { ytId: input.ytId },
      });

      if (existingCourse) return new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnail: input.thumbnail,
          // creatorId: ctx.session.user.id,
          ytId: input.ytId,
          price: parseInt(input.price),
          ytChannelId: input.ytChannelId,
          ytChannelName: input.ytChannelName,
          ytChannelImage: input.ytChannelImage,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          categoryId: input?.category?.id,
        },
      });

      const chapters = await Promise.all(
        input.chapters.map(async (cb, position) => {
          return await prisma.chapter.create({
            data: {
              ...cb,
              courseId: course.id,
              // creatorId: ctx.session.user.id,
              position,
            },
          });
        })
      );

      const ogImageRes = await generateStaticCourseOgImage({
        ogUrl: OG_URL,
        title: course.title,
        creatorName: course.ytChannelName ?? "",
        chapters: chapters.length,
        thumbnail: course.thumbnail ?? "",
      });

      const ogImage = ogImageRes
        ? await ogImageUpload(
            ogImageRes.data as AWS.S3.Body,
            course.id,
            "course"
          )
        : undefined;

      const updatedCourse = await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          ogImage,
        },
      });

      return { ...updatedCourse, chapters };
    }),

  syncImport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.id },
        include: {
          chapters: true,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });
      const playlistData = await getPlaylistDataService(course?.ytId ?? "");

      if (
        course?.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        return new TRPCError({ code: "BAD_REQUEST" });

      if (!playlistData) return new TRPCError({ code: "BAD_REQUEST" });

      const updatedCourse = await prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          title: playlistData.title,
          description: playlistData.description,
          thumbnail: playlistData.thumbnail,
          creatorId: ctx.session.user.id,
        },
      });

      const chapters = course.chapters;

      // delete removed chapters
      await Promise.all(
        chapters.map(async (chapter) => {
          const chapterExists = playlistData.videos.find(
            (video) => chapter.ytId === video.ytId
          );

          if (!chapterExists)
            await prisma.chapter.delete({
              where: {
                id: chapter.id,
              },
            });
        })
      );

      const updatedChapters = await Promise.all(
        playlistData.videos.map(async (video, idx) => {
          const chapterExists = chapters.find(
            (chapter) => chapter.ytId === video.ytId
          );

          if (chapterExists) {
            const updatedChapter = await prisma.chapter.update({
              where: {
                id: chapterExists.id,
              },
              data: {
                title: video.title,
                thumbnail: video.thumbnail,
                position: idx,
                description: video.description,
                duration: video.duration,
              },
            });
            return updatedChapter;
          } else {
            const newChapter = await prisma.chapter.create({
              data: {
                title: video.title,
                thumbnail: video.thumbnail,
                position: idx,
                ytId: video.ytId,
                videoUrl: `https://www.youtube.com/watch?v=${video.ytId}`,
                courseId: course.id,
                description: video.description,
                duration: video.duration,
              },
            });
            return newChapter;
          }
        })
      );

      const ogImageRes = await generateStaticCourseOgImage({
        ogUrl: OG_URL,
        title: updatedCourse.title,
        creatorName: ctx.session.user.name ?? "",
        chapters: updatedChapters.length,
        thumbnail: updatedCourse.thumbnail ?? "",
      });

      const ogImage = ogImageRes
        ? await ogImageUpload(
            ogImageRes.data as AWS.S3.Body,
            course.id,
            "course"
          )
        : undefined;

      const ogUpdatedCourse = await prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          ogImage,
        },
      });

      return { ...ogUpdatedCourse, chapters: updatedChapters };
    }),

  update: protectedProcedure
    .input(settingsFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.id },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      if (
        course?.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        return new TRPCError({ code: "BAD_REQUEST" });

      const updatedCourse = await prisma.course.update({
        where: { id: input.id },
        data: {
          price: parseInt(input.price),
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          categoryId: input?.category?.id,
        },
      });

      return updatedCourse;
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

  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.courseId },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!course || !user) return new TRPCError({ code: "BAD_REQUEST" });

      if (course.creatorId === user.id)
        return new TRPCError({ code: "BAD_REQUEST" });

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      });

      const audienceMember = await prisma.audienceMember.findFirst({
        where: {
          email: user.email,
          creatorId: course.creatorId ?? "",
        },
      });

      /* Adding to audience list */
      if (!audienceMember) {
        // if audience member doesn't exist, create one
        await prisma.audienceMember.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            creatorId: course.creatorId ?? "",
            courseId: course.id,
          },
        });
      }

      // const creator = await prisma.user.findUnique({
      //   where: {
      //     id: course.creatorId,
      //   },
      // });

      // TODO: send course enrollment confirmation
      // try {
      //   await sendRegistrationConfirmation(
      //     course,
      //     creator,
      //     user.email,
      //     user.name
      //   );
      // } catch (e) {
      //   console.log(e);
      // }

      return enrollment;
    }),

  isEnrolled: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      if (!ctx.session) return null;

      const enrolled = prisma.enrollment.findFirst({
        where: {
          userId: ctx.session.user.id,
          courseId: input.courseId,
        },
      });

      return enrolled;
    }),

  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                _count: {
                  select: {
                    chapters: true,
                  },
                },
                courseProgress: {
                  where: {
                    watchedById: ctx.session.user.id,
                  },
                  include: {
                    lastChapter: true,
                  },
                  take: 1,
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const enrollments = user?.enrollments
      .map((er) => ({
        ...er,
        course: {
          ...er.course,
          courseProgress: er.course.courseProgress[0],
        },
      }))
      .filter((er) => er.course.creatorId !== ctx.session.user.id);

    return enrollments;
  }),

  updateCourseProgress: protectedProcedure
    .input(z.object({ courseId: z.string(), lastChapterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const courseProgress = await prisma.courseProgress.findFirst({
        where: {
          watchedById: ctx.session.user.id,
          courseId: input.courseId,
        },
      });

      if (courseProgress) {
        const updatedCourseProgress = await prisma.courseProgress.update({
          where: {
            id: courseProgress.id,
          },
          data: {
            lastChapterId: input.lastChapterId,
          },
        });
        return updatedCourseProgress;
      } else {
        try {
          const newCourseProgress = await prisma.courseProgress.create({
            data: {
              watchedById: ctx.session.user.id,
              courseId: input.courseId,
              lastChapterId: input.lastChapterId,
            },
          });
          return newCourseProgress;
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    }),

  createTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const tag = await prisma.tag.create({
        data: {
          title: input,
        },
      });

      return tag;
    }),

  searchTags: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const tags = await prisma.tag.findMany({
        where: {
          title: {
            contains: input,
          },
        },
      });

      return tags;
    }),

  createCategory: protectedProcedure
    .input(createCategoryFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const catgs = await prisma.category.create({
        data: {
          title: input.title,
        },
      });

      return catgs;
    }),

  getCategories: publicProcedure.query(async ({ ctx, input }) => {
    const { prisma } = ctx;

    const catgs = await prisma.category.findMany({
      where: {
        title: {
          contains: input,
        },
      },
    });

    return catgs;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!course) return new TRPCError({ code: "BAD_REQUEST" });

      if (
        course.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        return new TRPCError({ code: "BAD_REQUEST" });

      const courseDeleted = await prisma.course.delete({
        where: {
          id: input.id,
        },
      });

      return courseDeleted;
    }),
});
