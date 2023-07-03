import ImageWF from "@/components/ImageWF";
import React from "react";
import CalenderBox from "./CalenderBox";
import Link from "next/link";
import { api } from "@/utils/api";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { type Event } from "@prisma/client";
import { TRPCError } from "@trpc/server";

type Props = {
  eventId: string;
  manage?: boolean;
};

const EventCardId = ({ eventId, manage }: Props) => {
  const { data: event } = api.event.get.useQuery({ id: eventId });

  if (event instanceof TRPCError) {
    return (
      <div className="flex w-full cursor-pointer flex-col justify-center gap-4 rounded-xl p-3 backdrop-blur transition-all hover:bg-neutral-700/50 xs:flex-row xs:items-center">
        <h1>Event Not Found</h1>
      </div>
    );
  }

  return (
    <Link
      href={
        manage
          ? `/creator/dashboard/event/${event?.id ?? ""}`
          : `/event/${event?.id ?? ""}`
      }
      className={`flex w-full cursor-pointer flex-col justify-center gap-4 rounded-xl p-3 backdrop-blur transition-all hover:bg-neutral-700/50 xs:flex-row xs:items-center`}
    >
      {event?.datetime && (
        <div className="hidden sm:block">
          <CalenderBox date={event?.datetime} />
        </div>
      )}
      <div
        className={`relative aspect-[18/9] w-full object-cover transition-all xs:w-2/5`}
      >
        <ImageWF
          src={event?.thumbnail ?? ""}
          alt={event?.title ?? ""}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-2 xs:w-3/5">
        <h5 className="line-clamp-1 overflow-hidden text-ellipsis text-base font-medium tracking-tight text-neutral-200 transition-all xs:text-sm sm:text-base lg:text-lg">
          {event?.title}
        </h5>

        <div className="m-0 flex flex-col items-start gap-1 p-0 text-left text-sm text-neutral-300 xs:text-xs sm:text-sm lg:text-base">
          <span className="flex items-center gap-1 sm:hidden">
            <CalendarIcon className="w-5" />{" "}
            {event?.datetime?.toLocaleString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-5" />
            {event?.datetime?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            to{" "}
            {event?.endTime?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const EventCard = ({
  event,
  manage,
}: {
  event: Event;
  manage?: boolean;
}) => {
  const isEventNow =
    event?.datetime?.getTime() <= new Date().getTime() &&
    event?.endTime?.getTime() >= new Date().getTime();

  return (
    <Link
      href={
        manage
          ? `/creator/dashboard/event/${event?.id ?? ""}`
          : `/event/${event?.id ?? ""}`
      }
      className={`relative flex w-full cursor-pointer flex-col justify-center gap-4 rounded-xl p-3 backdrop-blur-sm transition-all duration-300 hover:bg-neutral-700/60 xs:flex-row xs:items-center ${
        isEventNow ? "border-2 border-pink-600/10 hover:bg-neutral-900/50" : ""
      }`}
    >
      {isEventNow ? (
        <div className="absolute -right-1 -top-1">
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
            <span className="h-full w-full rounded-full bg-pink-500"></span>
          </span>
        </div>
      ) : (
        <></>
      )}
      {event?.datetime && (
        <div className="hidden sm:block">
          <CalenderBox date={event?.datetime} />
        </div>
      )}
      <div
        className={`relative aspect-[18/9] w-full max-w-[12rem] object-cover transition-all xs:w-2/5`}
      >
        <ImageWF
          src={event?.thumbnail ?? ""}
          alt={event?.title ?? ""}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-2 xs:w-3/5">
        <h5 className="line-clamp-2 overflow-hidden text-ellipsis text-base font-medium tracking-tight text-neutral-200 transition-all xs:text-sm sm:text-base lg:text-lg">
          {event?.title}
        </h5>

        <div className="m-0 flex flex-col items-start gap-1 p-0 text-left text-sm text-neutral-300 xs:text-xs sm:text-sm lg:text-base">
          <span className="flex items-center gap-1 sm:hidden">
            <CalendarIcon className="w-5" />{" "}
            {event?.datetime?.toLocaleString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-5" />
            {event?.datetime?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            to{" "}
            {event?.endTime?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCardId;
