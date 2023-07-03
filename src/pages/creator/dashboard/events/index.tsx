import { EventCard } from "@/components/EventCard";
import Head from "next/head";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "..";
import { usePathname } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import { PlusIcon } from "@heroicons/react/20/solid";
import ImageWF from "@/components/ImageWF";

const UpcomingEvents = () => {
  const { data: events, isLoading: isEventsLoading } =
    api.event.getAll.useQuery();

  if (isEventsLoading)
    return (
      <>
        <Head>
          <title>Events | Dashboard</title>
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      {events && events.length > 0 ? (
        <AnimatedSection
          delay={0.2}
          className="flex w-full max-w-3xl flex-col items-start gap-4"
        >
          {events?.map((event) => (
            <EventCard key={event?.id ?? ""} manage event={event} />
          ))}
        </AnimatedSection>
      ) : (
        <AnimatedSection
          delay={0.2}
          className="flex w-full flex-col items-center justify-center gap-2 p-4"
        >
          <div className="relative aspect-square w-40 object-contain">
            <ImageWF src="/empty/event_empty.svg" alt="empty" fill />
          </div>
          <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
            You have not created any events yet.
          </p>
          <Link
            href="/event/create"
            className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
          >
            <PlusIcon className="w-5" /> Create Event
          </Link>
        </AnimatedSection>
      )}
    </>
  );
};

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

UpcomingEvents.getLayout = EventsNestedLayout;

export default UpcomingEvents;

function EventsLayoutR({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <AnimatedSection
        delay={0.1}
        className="flex w-full items-center justify-between gap-4 px-4"
      >
        <h1 className="text-2xl text-neutral-200">Events</h1>
        <Link
          href="/event/create"
          className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <PlusIcon className="w-5" /> Create Event
        </Link>
      </AnimatedSection>
      <AnimatedSection
        delay={0.1}
        className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
      >
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href="/creator/dashboard/events"
              className={`inline-block rounded-t-lg p-4 ${
                pathname === "/creator/dashboard/events"
                  ? "border-b-2 border-pink-500 text-pink-500 transition"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
            >
              Upcoming
            </Link>
          </li>
          <li className="/creator/dashboard/events">
            <Link
              href="/creator/dashboard/events/past"
              className={`inline-block rounded-t-lg p-4 transition ${
                pathname === "/creator/dashboard/events/past"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
              aria-current="page"
            >
              Past
            </Link>
          </li>
        </ul>
      </AnimatedSection>
      {children}
    </div>
  );
}

function EventsLayout(page: ReactNode) {
  return <EventsLayoutR>{page}</EventsLayoutR>;
}

export { EventsLayout };
