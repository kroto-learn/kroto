import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { creatorRouter } from "@/server/api/routers/creator";
import { eventRouter } from "./routers/event/event";
import { emailRouter } from "./routers/email";
import { testimonialRouter } from "./routers/testimonial";
import { feedbacksRouter } from "./routers/event/feedback";
import { hostRouter } from "./routers/event/host";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  creator: creatorRouter,

  event: eventRouter,
  eventFeedback: feedbacksRouter,
  eventHost: hostRouter,

  email: emailRouter,
  testimonial: testimonialRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
