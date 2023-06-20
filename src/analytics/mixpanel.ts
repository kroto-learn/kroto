import mixpanel from "mixpanel-browser";
import { PageEvents, UserEvents } from "./events.interface";

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
        debug: process.env.NODE_ENV === "development",
        ignore_dnt: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  protected track(eventName: string, data: object = {}) {
    mixpanel.track(eventName, data);
  }

  public pageViewed(data: { pagePath: string }) {
    this.track(PageEvents.PAGE_VIEW, data);
  }

  private setIdentity(data: {
    email: string;
    name: string;
    id: string;
    avatar: string;
  }) {
    mixpanel.identify(data.id);
    mixpanel.people.set_once({
      $email: data.email,
      $name: data.name,
      $avatar: data.avatar,
      $last_login: MixPannelClient._last_login,
    });
  }

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
}
