import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { creatorRouter } from "@/server/api/routers/creator/creator";
import { eventRouter } from "./routers/event/event";
import { emailSenderRouter } from "./email/emailSender";
import { testimonialRouter } from "./routers/testimonial";
import { feedbacksRouter } from "./routers/event/feedback";
import { hostRouter } from "./routers/event/host";
import { courseRouter } from "./routers/course/course";
import { courseChapterRouter } from "./routers/course/chapter";
import { emailRouter } from "./email/email";
import { courseFeedbacksRouter } from "./routers/course/feedback";
import { contactRouter } from "./routers/contact";
import { askedQueryRouter } from "./routers/askedQuery";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  creator: creatorRouter,

  course: courseRouter,
  courseChapter: courseChapterRouter,
  courseFeedback: courseFeedbacksRouter,

  event: eventRouter,
  eventFeedback: feedbacksRouter,
  eventHost: hostRouter,

  emailSender: emailSenderRouter,
  email: emailRouter,

  testimonial: testimonialRouter,

  askedQuery: askedQueryRouter,


  contact: contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
