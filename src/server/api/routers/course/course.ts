import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import { getPlaylistDataService } from "@/server/services/youtube";
import { generateStaticCourseOgImage } from "@/server/services/og";
import { env } from "@/env.mjs";
import { imageUpload, ogImageUpload } from "@/server/helpers/s3";
import { settingsFormSchema } from "../../../../pages/creator/dashboard/course/[id]/settings";
import { isAdmin } from "@/server/helpers/admin";
import { sendClaimCourseRequest } from "@/server/helpers/emailHelper";
import { createCourseFormSchema } from "@/pages/course/create";
import { importCourseFormSchema } from "@/pages/course/import";
import { adminImportCourseFormSchema } from "@/pages/course/admin-import";
import { editCourseFormSchema } from "@/components/CourseEditModal";
import isBase64 from "is-base64";
import { TRPCError } from "@trpc/server";
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
          discount: true,
        },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });
      const isEnrolled = course?.enrollments.find(
        (er) => ctx.session.user.id === er.userId
      );

      if (
        !isEnrolled &&
        ctx.session.user.id !== course?.creatorId &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

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
          discount: true,
        },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

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
          discount: true,
        },
      });

      return courses;
    }),

  getAllPublic: publicProcedure
    .input(
      z
        .object({
          searchQuery: z.string().optional(),
          categoryTitle: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const query: {
        title: {
          contains: string;
        };
        category:
          | {
              title: {
                equals: string | undefined;
              };
            }
          | undefined;
      } = {
        title: {
          contains: input?.searchQuery ?? "",
        },
        category: {
          title: {
            equals: input?.categoryTitle,
          },
        },
      };

      if (!input?.categoryTitle) delete query["category"];

      const courses = await prisma.course.findMany({
        where: query,
        include: {
          _count: {
            select: {
              chapters: true,
            },
          },
          creator: true,
          tags: true,
          category: true,
          discount: true,
        },
      });

      const coursesWithLilCreatorData = courses.map((course) => ({
        ...course,
        creator: course?.creatorId
          ? {
              id: course?.creator?.id,
              name: course?.creator?.name,
              image: course?.creator?.image,
              creatorProfile: course?.creator?.creatorProfile,
            }
          : undefined,
      }));

      return coursesWithLilCreatorData;
    }),

  getAllAdmin: protectedProcedure
    .input(z.object({ searchQuery: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      if (!isAdmin(ctx.session.user.email ?? ""))
        throw new TRPCError({ code: "BAD_REQUEST" });

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
          discount: true,
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
          discount: true,
        },
      });

      return [...myCourses, ...unclaimedCourses];
    }),

  create: protectedProcedure
    .input(createCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) throw new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          creatorId: ctx.session.user.id,
          price: parseInt(input.price),
          permanentDiscount: parseInt(input.permanentDiscount),
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          outcomes: input.outcomes,
          startsAt: input.startsAt,
        },
      });

      const thumbnail = await imageUpload(input.thumbnail, course.id, "course");

      const discount = input.discount
        ? await prisma.discount.create({
            data: {
              courseId: course.id,
              price: parseInt(input.discount.price),
              deadline: input.discount.deadline,
            },
          })
        : undefined;

      // const chapters = await Promise.all(
      //   input.chapters.map(async (cb, position) => {
      //     return await prisma.chapter.create({
      //       data: {
      //         ...cb,
      //         courseId: course.id,
      //         position,
      //       },
      //     });
      //   })
      // );

      const ogImageRes = await generateStaticCourseOgImage({
        ogUrl: OG_URL,
        title: course.title,
        creatorName: ctx.session.user.name ?? "",
        chapters: 0,
        thumbnail,
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
          thumbnail,
        },
        include: {
          creator: true,
        },
      });

      return { ...updatedCourse, discount };
    }),

  import: protectedProcedure
    .input(importCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) throw new TRPCError({ code: "BAD_REQUEST" });

      const existingCourse = await prisma.course.findFirst({
        where: { ytId: input.ytId },
      });

      if (existingCourse) throw new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnail: input.thumbnail,
          creatorId: ctx.session.user.id,
          ytId: input.ytId,
          price: parseInt(input.price),
          permanentDiscount: parseInt(input.permanentDiscount),
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          categoryId: input?.category?.id,
        },
      });

      const discount = input.discount
        ? await prisma.discount.create({
            data: {
              courseId: course.id,
              price: parseInt(input.discount.price),
              deadline: input.discount.deadline,
            },
          })
        : undefined;

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

      return { ...updatedCourse, chapters, discount };
    }),

  adminImport: protectedProcedure
    .input(adminImportCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (!input) throw new TRPCError({ code: "BAD_REQUEST" });

      if (!isAdmin(ctx.session.user.email ?? ""))
        throw new TRPCError({ code: "BAD_REQUEST" });

      const existingCourse = await prisma.course.findFirst({
        where: { ytId: input.ytId },
      });

      if (existingCourse) throw new TRPCError({ code: "BAD_REQUEST" });

      const course = await prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          thumbnail: input.thumbnail,
          // creatorId: ctx.session.user.id,
          ytId: input.ytId,
          price: parseInt(input.price),
          permanentDiscount: parseInt(input.permanentDiscount),
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

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });
      const playlistData = await getPlaylistDataService(course?.ytId ?? "");

      if (
        course?.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      if (!playlistData) throw new TRPCError({ code: "BAD_REQUEST" });

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
    .input(editCourseFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.id },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

      let thumbnail = input.thumbnail;
      if (isBase64(input.thumbnail, { allowMime: true })) {
        thumbnail = await imageUpload(input.thumbnail, input.id, "course");
      }

      const ogImageRes = await generateStaticCourseOgImage({
        ogUrl: OG_URL,
        title: course.title,
        creatorName: ctx.session.user.name ?? "",
        chapters: 0,
        thumbnail,
      });

      const ogImage: string | undefined = ogImageRes
        ? await ogImageUpload(
            ogImageRes.data as AWS.S3.Body,
            input.id,
            "course"
          )
        : undefined;

      if (
        course?.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      const updatedCourse = await prisma.course.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          thumbnail,
          ogImage,
          price: parseInt(input.price),
          permanentDiscount: parseInt(input.permanentDiscount),
          outcomes: input.outcomes,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { id: tag.id },
              create: { title: tag.title },
            })),
          },
          startsAt: input.startsAt,
        },
        include: {
          discount: true,
          creator: true,
        },
      });

      if (updatedCourse?.discount) {
        if (input.discount)
          await prisma.discount.update({
            where: {
              id: updatedCourse?.discount?.id,
            },
            data: {
              price: parseInt(input?.discount?.price),
              deadline: input?.discount?.deadline,
            },
          });
        else
          await prisma.discount.delete({
            where: {
              id: updatedCourse?.discount?.id,
            },
          });
      } else {
        if (input.discount)
          await prisma.discount.create({
            data: {
              courseId: updatedCourse?.id,
              price: parseInt(input?.discount?.price),
              deadline: input?.discount?.deadline,
            },
          });
      }

      return updatedCourse;
    }),

  settingsUpdate: protectedProcedure
    .input(settingsFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const course = await prisma.course.findUnique({
        where: { id: input.id },
      });

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

      if (
        course?.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

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
        include: {
          discount: true,
        },
      });

      if (updatedCourse?.discount) {
        if (input.discount)
          await prisma.discount.update({
            where: {
              id: updatedCourse?.discount?.id,
            },
            data: {
              price: parseInt(input?.discount?.price),
              deadline: input?.discount?.deadline,
            },
          });
        else
          await prisma.discount.delete({
            where: {
              id: updatedCourse?.discount?.id,
            },
          });
      } else {
        if (input.discount)
          await prisma.discount.create({
            data: {
              courseId: updatedCourse?.id,
              price: parseInt(input?.discount?.price),
              deadline: input?.discount?.deadline,
            },
          });
      }

      return updatedCourse;
    }),

  addClaimCourseRequest: publicProcedure
    .input(z.object({ courseId: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const claimRequest = await prisma.claimCourseRequest.create({
        data: {
          ...input,
        },
      });
      await sendClaimCourseRequest({ ...input });

      return claimRequest;
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

      if (!course) throw new TRPCError({ code: "BAD_REQUEST" });

      if (
        course.creatorId !== ctx.session.user.id &&
        !isAdmin(ctx.session.user.email ?? "")
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      const courseDeleted = await prisma.course.delete({
        where: {
          id: input.id,
        },
      });

      return courseDeleted;
    }),

});
