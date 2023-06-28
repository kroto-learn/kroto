import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import { EventCard } from "@/components/EventCard";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import ImageWF from "@/components/ImageWF";
import { MixPannelClient } from "@/analytics/mixpanel";

const MyEvents = () => {
  const router = useRouter();

  const { data: profile, isLoading } = api.creator.getProfile.useQuery();
  const { data: pastRegisteredEvents, isLoading: isPastLoading } =
    api.creator.getPastEvents.useQuery();

  const isPastTab = router.query.events === "past";
  const upcomingEvents = profile?.registrations;
  const pastEvents = pastRegisteredEvents;
  const events = isPastTab ? pastEvents : upcomingEvents;

  useEffect(() => {
    if (isPastTab) MixPannelClient.getInstance().pastEventTabViewed();
  }, [isPastTab]);

  return (
    <>
      <AnimatedSection
        delay={0.3}
        className="mb-10 flex w-full max-w-4xl flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4 sm:p-8"
      >
        <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
          <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
            Registered Events
          </h1>
          <div className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <ul className="-mb-px flex flex-wrap">
              <li className="mr-2">
                <Link
                  href="/dashboard/events"
                  className={`inline-block rounded-t-lg p-4 ${
                    !isPastTab
                      ? "border-b-2 border-pink-500 text-pink-500 transition"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                >
                  Upcoming
                </Link>
              </li>
              <li className="/dashboard/events">
                <Link
                  href="/dashboard/events?events=past"
                  className={`inline-block rounded-t-lg p-4 transition ${
                    isPastTab
                      ? "border-b-2 border-pink-500 text-pink-500"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                  aria-current="page"
                >
                  Past
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {(isPastTab ? isPastLoading : isLoading) ? (
          <div className="flex h-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {events && events.length > 0 ? (
              <>
                <div className="my-2 flex flex-col gap-2">
                  {events?.map((e) => (
                    <div key={e.id ?? ""}>
                      <EventCard event={e} />
                    </div>
                  ))}
                </div>
                {/* <div className="mx-5 mb-2 flex justify-between">
                      <button className="text-pink-500 transition hover:text-pink-600">
                        View More
                      </button>
                      <button className="text-pink-500 transition hover:text-pink-600">
                        Show past
                      </button>
                    </div> */}
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                <div className="relative aspect-square w-40 object-contain">
                  <ImageWF src="/empty/event_empty.svg" alt="empty" fill />
                </div>
                <p className="mb-2 text-center text-neutral-400 sm:text-left">
                  {isPastTab
                    ? "You don't have any past registered events."
                    : "You don't have any upcoming registered events."}
                </p>
              </div>
            )}
          </>
        )}
      </AnimatedSection>
    </>
  );
};

export default MyEvents;

MyEvents.getLayout = DashboardLayout;
