export enum PageEvents {
  PAGE_VIEW = "Page View",
  LANDING_PAGE_VIEW = "Landing Page View",
}

export enum LandingPageEvents {
  LANDING_PAGE_VIEW = "Landing Page View",
  CLAIM_LINK_FOCUSED = "Claim Link Focused",
  CLAIM_LINK_CLICED = "Claim Link Clicked",
}

export enum UserEvents {
  USER_SIGN_UP = "User Sign Up",
  USER_SIGN_IN = "User Sign In",
  USER_SIGN_OUT = "User Sign Out",

  CREATOR_SIGN_UP = "Creator Sign Up",
}

export enum PROFILE_EVENTS {
  PROFILE_VIEWED = "Profile Viewed",
  PROFILE_UPDATED = "Profile Updated",

  PROFILE_EVENT_TAB_VIEWED = "Profile Event Viewed",
  PROFILE_TESTIMONIAL_TAB_VIEWED = "Profile Testimonial Viewed",
  PROFILE_COURSE_TAB_VIEWED = "Profile Course Viewed",

  GIVE_TESTIMONIAL_CLICKED = "Give Testimonial Clicked",
  GIVE_TESTIMONIAL_SUBMITTED = "Give Testimonial Submitted",

  ASK_QUERY_CLICKED = "Ask Query Clicked",
  ASK_QUERY_SUBMITTED = "Ask Query Submitted",
}

export enum DashboardEvents {
  DASHBOARD_VIEWED = "Dashboard Viewed",
  PAST_EVENT_TAB_VIEWED = "Past Event Tab Viewed",
}

export enum CourseEvents {
  COURSE_CREATED = "Course Created",
  COURSE_UPDATED = "Course Updated",
  COURSE_DELETED = "Course Deleted",

  COURSE_ENROLLED = "Course Enrolled",
  COURSE_VIEWED = "Course Viewed",
  COURSE_SHARED = "Course Shared",

  CREATOR_PROFILE_CLICKED = "Creator Profile Clicked",
}

export enum LessonEvents {
  LESSON_STARTED = "Lesson Watched",
  LESSON_COMPLETED = "Lesson Completed",
  LESSON_SHARED = "Lesson Shared",

  MARK_AS_COMPLETE_CLICKED = "Mark As Complete Clicked",
  NEXT_LESSON_CLICKED = "Next Lesson Clicked",

  OVERVIEW_COLLAPSED = "Overview Collapsed",

  LESSON_WATCHED_5 = "Lesson Watched 5m",
}
