import mixpanel from "mixpanel-browser";

export class MixPannelTracking {
  private static _instance: MixPannelTracking;

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
    console.log("pageViewed", data);
    this.track("pageViewed", data);
  }
}
