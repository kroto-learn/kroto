import mixpanel from "mixpanel-browser";
import {
  CourseEvents,
  DashboardEvents,
  LessonEvents,
  PROFILE_EVENTS,
  PageEvents,
  UserEvents,
} from "./events.interface";

export class MixPannelClient {
  private static _instance: MixPannelClient;
  private static _distict_id: string;
  private static _last_login = new Date();
  private static _logged_in = false;

  public static getInstance(): MixPannelClient {
    if (MixPannelClient._instance == null) {
      return (MixPannelClient._instance = new MixPannelClient());
    }

    return this._instance;
  }

  public constructor() {
    if (MixPannelClient._instance) {
      throw new Error(
        "Error: Instance creation of MixPannelTracking is not allowed. Use MixPannelTracking.getInstance() instead."
      );
    }

    try {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID ?? "", {
        debug: process.env.NODE_ENV !== "production",
        ignore_dnt: true,
        api_host: "https://api.mixpanel.com",
        loaded: (_mix) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          MixPannelClient._distict_id = _mix.get_distinct_id();
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private setIdentity(data: {
    email: string;
    name: string;
    id: string;
    avatar: string;
  }) {
    mixpanel.identify(data.id);
    mixpanel.people.set({
      $email: data.email,
      $name: data.name,
      $avatar: data.avatar,
      $last_login: MixPannelClient._last_login,
    });
    mixpanel.alias(MixPannelClient._distict_id, data.id);
  }

  protected track(eventName: string, data: object = {}) {
    mixpanel.track(eventName, data);
  }

  public pageViewed(data: { pagePath: string }) {
    this.track(PageEvents.PAGE_VIEW, data);
  }

  // User Events
  public signIn(data: {
    provider: string;
    email: string;
    name: string;
    id: string;
  }) {
    mixpanel.identify(data.id);
    this.track(UserEvents.USER_SIGN_IN, data);
  }

  public signUp(data: {
    provider: string;
    email: string;
    name: string;
    id: string;
  }) {
    this.track(UserEvents.USER_SIGN_UP, data);
  }

  public signOut(data: { email: string; name: string; id: string }) {
    this.track(UserEvents.USER_SIGN_OUT, data);
  }

  public authenticatedVisit(data: {
    email: string;
    name: string;
    id: string;
    avatar: string;
  }) {
    this.track(UserEvents.AUTHENTICATED_VISIT, data);
    this.setIdentity(data);
  }

  public dashboardViewed() {
    this.track(DashboardEvents.DASHBOARD_VIEWED);
  }

  public pastEventTabViewed() {
    this.track(DashboardEvents.PAST_EVENT_TAB_VIEWED);
  }

  // Profile Events
  public profileViewed(data: { userId: string; creatorProfile: string }) {
    this.track(PROFILE_EVENTS.PROFILE_VIEWED, data);
  }

  public profileEventTabViewed(data: {
    userId: string;
    creatorProfile: string;
  }) {
    this.track(PROFILE_EVENTS.PROFILE_EVENT_TAB_VIEWED, data);
  }

  public profileTestimonialTabViewed(data: {
    userId: string;
    creatorProfile: string;
  }) {
    this.track(PROFILE_EVENTS.PROFILE_TESTIMONIAL_TAB_VIEWED, data);
  }

  public profileCourseTabViewed(data: {
    userId: string;
    creatorProfile: string;
  }) {
    this.track(PROFILE_EVENTS.PROFILE_COURSE_TAB_VIEWED, data);
  }

  public giveTestimonialClicked(data: {
    userId: string;
    creatorProfile: string;
  }) {
    this.track(PROFILE_EVENTS.GIVE_TESTIMONIAL_CLICKED, data);
  }

  public giveTestimonialSubmitted(data: {
    userId: string;
    creatorProfile: string;
  }) {
    this.track(PROFILE_EVENTS.GIVE_TESTIMONIAL_SUBMITTED, data);
  }

  public askQueryClicked(data: { userId: string; creatorProfile: string }) {
    this.track(PROFILE_EVENTS.ASK_QUERY_CLICKED, data);
  }

  public askQuerySubmitted(data: { userId: string; creatorProfile: string }) {
    this.track(PROFILE_EVENTS.ASK_QUERY_SUBMITTED, data);
  }

  // Course Events
  public courseCreated(data: { courseId: string }) {
    this.track(CourseEvents.COURSE_CREATED, data);
  }

  public courseUpdated(data: { courseId: string }) {
    this.track(CourseEvents.COURSE_UPDATED, data);
  }

  public courseDeleted(data: { courseId: string }) {
    this.track(CourseEvents.COURSE_DELETED, data);
  }

  public courseViewed(data: { userId: string; courseId: string }) {
    this.track(CourseEvents.COURSE_VIEWED, data);
  }

  public courseEnrolled(data: { courseId: string; userId: string }) {
    this.track(CourseEvents.COURSE_ENROLLED, data);
  }

  public courseShared(data: { courseId: string; userId: string }) {
    this.track(CourseEvents.COURSE_SHARE_CLICKED, data);
  }

  public courseLandingViewed() {
    this.track(CourseEvents.COURSE_LANDING_VIEWED);
  }

  public exploreCoursesClicked(data: { position: 1 | 2 }) {
    this.track(CourseEvents.EXPLORE_COURSE_CLICKED, data);
  }

  public courseSharedType(data: {
    courseId: string;
    userId: string;
    type: string;
  }) {
    this.track(CourseEvents.COURSE_SHARED_TYPE, data);
  }

  public coursePlayed(data: { userId: string; courseId: string }) {
    this.track(CourseEvents.COURSE_VIEWED, data);
  }

  public backToDashboardClicked(data: {
    courseId: string;
    userId: string;
    lessonId: string;
  }) {
    this.track(CourseEvents.BACK_TO_DASHBOARD_CLICKED, data);
  }

  public creatorProfileClickedFromCourse(data: {
    courseId: string;
    creatorId: string;
    userId: string;
  }) {
    this.track(CourseEvents.CREATOR_PROFILE_CLICKED_FROM_COURSE, data);
  }

  // Lesson Events
  public lessonStarted(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.LESSON_STARTED, data);
  }

  public lessonCompleted(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.LESSON_COMPLETED, data);
  }

  public markLessonAsComplete(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.MARK_AS_COMPLETE_CLICKED, data);
  }

  public nextLessonClicked(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.NEXT_LESSON_CLICKED, data);
  }

  public previousLessonClicked(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.PREVIOUS_LESSON_CLICKED, data);
  }

  public overViewCollapsed(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.OVERVIEW_COLLAPSED, data);
  }

  public lessonWatchedForFiveMinutes(data: {
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.LESSON_WATCHED_5, data);
  }

  public bookASessionClicked(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.BOOK_A_SESSION_CLICKED, data);
  }

  public sessionChoosed_15(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.SESSON_CHOOSED_15, data);
  }

  public sessionChoosed_30(data: {
    lessonId: string;
    courseId: string;
    userId: string;
  }) {
    this.track(LessonEvents.SESSON_CHOOSED_30, data);
  }
}
