import CourseEventCard from "@/components/CourseEventCard";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import EventsLayout from "./layout";
import DashboardLayout from "../layout";
import { getEventsClient } from "mock/getEventsClient";
import { type CourseEvent } from "interfaces/CourseEvent";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<CourseEvent[]>([]);
  useEffect(() => {
    const loadEvents = async () => {
      setEvents(await getEventsClient());
    };
    void loadEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      <div className="flex w-full flex-col items-start gap-4">
        {events.map((event) => (
          <CourseEventCard key={event.title} manage courseevent={event} />
        ))}
      </div>
    </>
  );
};

const nestLayout = (parent: any, child: any) => {
  return (page: any) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

UpcomingEvents.getLayout = EventsNestedLayout;

export default UpcomingEvents;
