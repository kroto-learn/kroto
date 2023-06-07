import { EventCard } from "@/components/EventCard";
import Head from "next/head";
import React from "react";
import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { DashboardLayout } from ".";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { useRouter } from "next/router";

const RegisteredEvents = () => {
  const router = useRouter();
  const { data: creator, isLoading: isUpcomingLoading } =
    api.creator.getProfile.useQuery();
  const { data: pastRegisteredEvents, isLoading: isPastLoading } =
    api.creator.getPastEvents.useQuery();

  const isPastTab = router.query.events === "past";
  const upcomingEvents = creator?.registrations;
  const pastEvents = pastRegisteredEvents;
  const events = isPastTab ? pastEvents : upcomingEvents;

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      <div className="mb-10 ml-4 flex flex-col gap-4 px-4 py-8">
        <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
          <h1 className="text-xl text-neutral-200 sm:text-2xl">
            Registered Events
          </h1>
          <div className="sm: border-b border-neutral-400 text-center text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <ul className="-mb-px flex flex-wrap">
              <li className="sm:mr-2">
                <Link
                  href="/creator/dashboard/registered-events"
                  className={`inline-block rounded-t-lg p-4 ${
                    !isPastTab
                      ? "border-b-2 border-pink-500 text-pink-500 transition"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                >
                  Upcoming
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/dashboard/registered-events?events=past"
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

        {(isPastTab ? isPastLoading : isUpcomingLoading) ? (
          <div className="flex h-64 items-center justify-center">
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
                <p className="mb-2 text-center text-neutral-400">
                  {isPastTab
                    ? "You don't have any past registered events."
                    : "You don't have any upcoming registered events."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

RegisteredEvents.getLayout = DashboardLayout;

export default RegisteredEvents;
