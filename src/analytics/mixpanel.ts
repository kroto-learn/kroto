import mixpanel from "mixpanel-browser";
import { PageEvents, UserEvents } from "./events.interface";

export class MixPannelTracking {
  private static _instance: MixPannelTracking;
  private static _distict_id: string;
  private static _last_login = new Date();
  private static _logged_in = false;

  public static getInstance(): MixPannelTracking {
    if (MixPannelTracking._instance == null) {
      return (MixPannelTracking._instance = new MixPannelTracking());
    }

    return this._instance;
  }

  public constructor() {
    if (MixPannelTracking._instance) {
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
}
