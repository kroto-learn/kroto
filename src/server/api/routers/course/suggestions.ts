import { isAdmin } from "@/server/helpers/admin";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { suggestCourseSchema } from "@/components/SuggestCourseModal";

import { getPlaylistDataShallowService } from "@/server/services/youtube";
import { TRPCError } from "@trpc/server";

export const suggestionCourseRouter = createTRPCRouter({
  suggestCourse: protectedProcedure
    .input(suggestCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const suggestCourse = await prisma.suggestedCourse.create({
        data: { playlistId: input.playlistId, userId: ctx.session.user.id },
      });

      return suggestCourse;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    if (!isAdmin(ctx.session.user.email ?? ""))
      throw new TRPCError({ code: "BAD_REQUEST" });

    const suggestions = await prisma.suggestedCourse.findMany({
      include: { user: true },
    });

    const suggestionsWithPtData = await Promise.all(
      suggestions.map(async (sg) => {
        const pdata = await getPlaylistDataShallowService(sg.playlistId);

        return { ...sg, playlist: pdata };
      })
    );

    return suggestionsWithPtData;
  }),
});
