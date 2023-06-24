import { UserEvents } from "@/analytics/events.interface";
import { env } from "@/env.mjs";
import * as mixpanel from "mixpanel";

export class MixPanelServer {
  private static _instance: MixPanelServer;
  private static _distict_id: string;
  private static _last_login = new Date();
  private static _logged_in = false;

  public static getInstance(): MixPanelServer {
    if (MixPanelServer._instance == null) {
      return (MixPanelServer._instance = new MixPanelServer());
    }

    return this._instance;
  }

  public constructor() {
    if (MixPanelServer._instance) {
      throw new Error(
        "Error: Instance creation of MixPannelTracking is not allowed. Use MixPannelTracking.getInstance() instead."
      );
    }

    try {
      mixpanel.init(env.MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === "development",
        ignore_dnt: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  protected track(eventName: string, data: object = {}) {
    MixPanelServer._instance.track(eventName, data);
  }

  public signIn(data: {
    provider: string;
    email: string;
    name: string;
    id: string;
  }) {
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
