import React from "react";
import CourseCard from "../CourseCard";
import type { Event } from "interfaces/Event";

type Prop = {
  events: Event[];
};

const Events = ({ events }: Prop) => {
  return (
    <div className="my-8 flex w-full max-w-7xl flex-col justify-start gap-8">
      <h2 className="text-3xl text-white">Events</h2>
      <div className="flex flex-wrap gap-12">
        {events.map((event) => (
          <CourseCard key={event.title} course={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
