import CourseEventCard from "@/components/CourseEventCard";
import { getEvents } from "mock/getEvents";
import React from "react";

export const metadata = {
  title: "Events | Dashboard",
};

const UpcomingEvents = async () => {
  const events = await getEvents();

  return (
    <>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <CourseEventCard key={event.title} manage courseevent={event} />
        ))}
      </div>
    </>
  );
};

export default UpcomingEvents;
