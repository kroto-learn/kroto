import { type CourseEvent } from "interfaces/CourseEvent";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout";
import { getEventsClient } from "mock/getEventsClient";
import EventLayout from "./layout";

const EventSettings = () => {
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
        <title>{(event?.title as string) + "| Settings"}</title>
      </Head>
    </>
  );
};

export default EventSettings;

const nestLayout = (parent: any, child: any) => {
  return (page: any) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventSettings.getLayout = EventsNestedLayout;
