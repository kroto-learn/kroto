import React from "react";
import CourseCard from "../CourseCard";
import type { Event } from "interfaces/Event";

type Prop = {
  events: Event[];
};

const Events = ({ events }: Prop) => {
  return (
    <div className="my-8 flex flex-col items-start justify-start gap-8">
      <h2 className="text-3xl text-neutral-200">Upcoming Events</h2>
      <div className="flex flex-col gap-12">
        {events.map((event) => (
          <CourseCard key={event.title} course={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
