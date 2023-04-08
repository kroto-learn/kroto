import { getEvents } from "mock/getEvents";
import React from "react";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);

  return {
    title: (event?.title as string) + "| Settings",
  };
}

const EventSettings = () => {
  return <>Hello</>;
};

export default EventSettings;
