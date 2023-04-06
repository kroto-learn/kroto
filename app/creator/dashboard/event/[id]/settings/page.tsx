import { getEventsClient } from "mock/getEventsClient";
import React from "react";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const events = await getEventsClient();
  const event = events.find((e) => e.id === params.id);

  return {
    title: (event?.title as string) + "| Settings",
  };
}

const EventSettings = () => {
  return <>Hello</>;
};

export default EventSettings;
