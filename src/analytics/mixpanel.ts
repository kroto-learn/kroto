import mixpanel from "mixpanel-browser";

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
        "ERROR: Instance cannot be created. Use MixPannelTracking.getInstance()"
      );
    }
    const isDev = process.env.NODE_ENV !== "production";
    try {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || "", {
        debug: isDev,
        ignore_dnt: true,
        api_host: "https://api.mixpanel.com",
        loaded: (_mix) => {
          MixPannelTracking._distict_id = _mix.get_distinct_id();
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  private noStagingWrapper(cb: Function = () => {}, eventName = "") {
    // if (process.env.NEXT_PUBLIC_ENV_NAME === 'STAGING') {
    //   console.warn(
    //       `MIXPANNEL::EVENT::${eventName}.Test Environment, not tracking`)
    //   return;
    // }
    try {
      cb();
    } catch (err) {
      console.log(err);
    }
  }

  protected track(name: string, data: object = {}) {
    this.noStagingWrapper(() => mixpanel.track(name, data));
  }
  protected trackImmediate(name: string, data: object = {}) {
    this.noStagingWrapper(() =>
      mixpanel.track(name, data, { send_immediately: false })
    );
  }

  protected register(data: object = {}) {
    this.noStagingWrapper(() => mixpanel.register(data));
  }

  protected registerOnce(data: object = {}, defaultData?: any) {
    this.noStagingWrapper(() => mixpanel.register_once(data, defaultData));
  }

  protected alias(id: string) {
    this.noStagingWrapper(() => mixpanel.alias(id));
  }

  protected identify(id: string) {
    this.noStagingWrapper(() => mixpanel.identify(id));
  }

  protected peopleSet(data: object = {}) {
    this.noStagingWrapper(() => mixpanel.people.set(data));
  }
  protected peopleSetOnce(data: object = {}) {
    this.noStagingWrapper(() => mixpanel.people.set_once(data));
  }
  protected peopleIncrement(data: { [index: string]: number } = {}) {
    this.noStagingWrapper(() => mixpanel.people.increment(data));
  }

  // METHODS TO BE USED
  // public pageViewed(name: keyof typeof SITE_PAGES) {
  //   const props = {
  //     [PageKeys.NAME]: name,
  //     [PageKeys.VISIT_TIME]: new Date().toISOString(),
  //   };
  //   this.track(PageEvents.PAGE_VIEW, props);
  // }
}
