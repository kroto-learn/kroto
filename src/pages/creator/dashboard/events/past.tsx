import React, { type ReactNode } from "react";
import { DashboardLayout } from "..";
import { EventsLayout } from ".";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import Head from "next/head";
import { EventCard } from "@/components/EventCard";
import ImageWF from "@/components/ImageWF";

export const metadata = {
  title: "Past Events | Dashboard",
};

const PastEvents = () => {
  const { data: events, isLoading: isEventsLoading } =
    api.event.getAllPast.useQuery();

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
          <p className="mb-2 text-center text-neutral-400">
            You don&apos;t have any past events.
          </p>
        </AnimatedSection>
      )}
    </>
  );
};

export default PastEvents;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

PastEvents.getLayout = EventsNestedLayout;
