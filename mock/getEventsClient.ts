import { type CourseEvent } from "interfaces/CourseEvent";

export const getEventsClient = async () => {
  const data = await fetch("/data.json");
  return ((await data.json()) as { events: CourseEvent[] })?.events;
};
