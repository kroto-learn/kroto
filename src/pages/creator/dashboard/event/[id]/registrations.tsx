import { type CourseEvent } from "interfaces/CourseEvent";
import { getEvents } from "mock/getEvents";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EventRegistrations = () => {
  const [event, setEvent] = useState<CourseEvent | undefined>(undefined);
  const router = useRouter();
  const { id } = router.query as { id: string };

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEvents();

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
