import DashboardEventTabWrapper from "@/components/DashboardEventTabWrapper";
import DashboardNavWrapper from "@/components/DashboardNavWrapper";
import { type CourseEvent } from "interfaces/CourseEvent";
import { getEventsClient } from "mock/getEventsClient";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EventRegistrations = () => {
  const router = useRouter();
  const [event, setEvent] = useState<CourseEvent | undefined>(undefined);

  useEffect(() => {
    const loadEvents = async () => {
      const events = await getEventsClient();
      const matchedEvent = events.find((e) => e.id === router.query.id);
      matchedEvent && setEvent(matchedEvent);
    };
    void loadEvents();
  }, [router]);

  return (
    <>
      <Head>
        <title>{event?.title} | Registrations</title>
      </Head>
      <DashboardNavWrapper>
        {" "}
        <DashboardEventTabWrapper>Hello</DashboardEventTabWrapper>
      </DashboardNavWrapper>
    </>
  );
};

export default EventRegistrations;
