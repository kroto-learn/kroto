import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import {
  getPlaylistDataAdminService,
  getPlaylistDataService,
  getPlaylistDataShallowService,
  searchYoutubePlaylistsAdminService,
  searchYoutubePlaylistsService,
} from "@/server/services/youtube";
import { TRPCError } from "@trpc/server";
import { isAdmin } from "@/server/helpers/admin";

export const ytCourseRouter = createTRPCRouter({
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

  getYoutubePlaylistShallow: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      const playlist = await getPlaylistDataShallowService(input.playlistId);

      return playlist;
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
});
