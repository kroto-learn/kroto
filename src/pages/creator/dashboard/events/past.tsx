import React, { type ReactNode } from "react";
import { DashboardLayout } from "..";
import { EventsLayout } from ".";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import Head from "next/head";
import { EventCard } from "@/components/EventCard";

export const metadata = {
  title: "Past Events | Dashboard",
};

const PastEvents = () => {
  const { data: events, isLoading: isEventsLoading } =
    api.event.getAllPast.useQuery();

  if (isEventsLoading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      <div className="flex w-full flex-col items-start gap-4">
        {events?.map((event) => (
          <EventCard key={event?.id ?? ""} manage event={event} />
        ))}
      </div>
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
