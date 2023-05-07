import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  getYoutubePlaylists: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      console.log("user", ctx.session.user);
      const token = ctx.session.user.token;

      return token;
    }),
});
