import { type CourseEvent } from "interfaces/CourseEvent";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { type ReactNode, useEffect, useState } from "react";
import { getEventsClient } from "mock/getEventsClient";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";

const EventRegistrations = () => {
  const [event, setEvent] = useState<CourseEvent | undefined>(undefined);
  const router = useRouter();
  const { id } = router.query as { id: string };

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEventsClient();

      const mevent = events.find((e) => e.id === id);

      if (mevent) setEvent(mevent);
    };
    void loadEvent();
  }, [id]);
  return (
    <>
      <Head>
        <title>{(event?.title as string) + "| Registrations"}</title>
      </Head>
    </>
  );
};

export default EventRegistrations;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventRegistrations.getLayout = EventNestedLayout;
