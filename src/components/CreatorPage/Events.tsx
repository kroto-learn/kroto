import React from "react";
import type { Event } from "interfaces/Event";
import EventCard from "../EventCard";

type Prop = {
  events: Event[];
};

const Events = ({ events }: Prop) => {
  return (
    <div className="my-8 flex flex-col items-start justify-start gap-8 p-8">
      <h2 className="text-2xl text-neutral-200">Upcoming Events</h2>
      <div className="flex flex-col gap-12">
        {events.map((event) => (
          <EventCard key={event.title} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
