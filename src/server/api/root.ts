import { createTRPCRouter } from "@/server/api/trpc";
import { paymetnRouter } from "./routers/creator/payments";
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
import { trackingRouter } from "./routers/course/tracking";
import { ytCourseRouter } from "./routers/course/yt";
import { tagsCourseRouter } from "./routers/course/tags";
import { categoriesCourseRouter } from "./routers/course/categories";
import { enrollmentCourseRouter } from "./routers/course/enrollment";
import { suggestionCourseRouter } from "./routers/course/suggestions";
import { dailyReminderRouter } from "./routers/reminders/daily";
import { cronTestRouter } from "./cront-test";
import { promoCodeCourseRouter } from "./routers/course/promoCode";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: paymetnRouter,
  creator: creatorRouter,

  course: courseRouter,
  courseChapter: courseChapterRouter,
  enrollmentCourse: enrollmentCourseRouter,
  courseFeedback: courseFeedbacksRouter,
  tracking: trackingRouter,
  ytCourse: ytCourseRouter,
  tagsCourse: tagsCourseRouter,
  categoriesCourse: categoriesCourseRouter,
  promoCodeCourse: promoCodeCourseRouter,
  suggestionsCourse: suggestionCourseRouter,

  emailReminder: dailyReminderRouter,

  event: eventRouter,
  eventFeedback: feedbacksRouter,
  eventHost: hostRouter,

  emailSender: emailSenderRouter,
  email: emailRouter,

  testimonial: testimonialRouter,

  askedQuery: askedQueryRouter,

  cronEmailTesting: cronTestRouter,

  contact: contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
