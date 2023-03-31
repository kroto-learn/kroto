import type { Event } from "interfaces/Event";
import Image from "next/image";
import React from "react";
import { HiArrowSmRight } from "react-icons/hi";
import DateTime from "./DateTime";
type Props = {
  event: Event;
  collapsed?: boolean;
};

const EventCard = ({ event, collapsed }: Props) => {
  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border border-neutral-700 bg-neutral-800 shadow transition-all duration-300 sm:flex-row ${
        collapsed
          ? "h-24 w-full max-w-lg items-center p-2 px-3"
          : "max-w-2xl p-3"
      }`}
    >
      <div
        className={`relative aspect-[16/10] object-cover transition-all duration-300
        ${collapsed ? "h-full" : "w-full sm:w-[18rem] md:w-[30rem]"}
        `}
      >
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className="flex w-full flex-col gap-3">
        <h5
          className={`mb-2 font-medium tracking-tight text-neutral-200 transition-all duration-300 ${
            collapsed ? "text-xs" : "text-lg"
          }`}
        >
          {event.title}
        </h5>
        <p
          className={`duration-30 mb-3 max-h-[4rem] overflow-y-hidden text-sm font-normal text-gray-400 transition-all ${
            collapsed ? "hidden" : ""
          }`}
        >
          {event.description}
        </p>
        <div className="flex w-full items-center justify-between gap-4">
          {!collapsed ? (
            <DateTime datetime={event.datetime} duration={event.duration} />
          ) : (
            <></>
          )}
          <div className="flex items-center gap-4">
            <p className={`text-green-500 ${collapsed ? "text-xs" : ""}`}>
              FREE
            </p>
            <a
              href="#"
              className={`group inline-flex items-center gap-[0.15rem] rounded-lg bg-pink-600 text-center font-medium text-neutral-200 transition-all duration-300 ${
                collapsed ? "px-2 py-1 text-xs" : "px-3  py-2 text-sm"
              }`}
            >
              Enroll now
              <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
