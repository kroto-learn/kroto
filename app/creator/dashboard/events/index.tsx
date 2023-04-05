import CourseEventCard from "@/components/CourseEventCard";
import { type CourseEvent } from "interfaces/CourseEvent";
import { getEventsClient } from "mock/getEventsClient";
import Head from "next/head";
import React, { useEffect, useState } from "react";

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
        <title>Events</title>
      </Head>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <CourseEventCard key={event.title} manage courseevent={event} />
        ))}
      </div>
    </>
  );
};

export default UpcomingEvents;
