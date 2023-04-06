import CourseEventCard from "@/components/CourseEventCard";
import { getEvents } from "mock/getEvents";
import React from "react";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: "whfh456" }];
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);

  return {
    title: (event?.title as string) + "| Overview",
  };
}

export default async function EventOverview({ params }: Props) {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);

  if (event) return <CourseEventCard courseevent={event} />;
  else return <></>;
}
