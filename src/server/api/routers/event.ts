import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createFormSchema } from "@/pages/event/create";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure.input(createFormSchema).query(({ input, ctx }) => {

    return {};
  }),
});
