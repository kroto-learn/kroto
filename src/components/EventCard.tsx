import Image from "next/image";
import React from "react";
import CalenderBox from "./CalenderBox";
import Link from "next/link";
import { BiTimeFive } from "react-icons/bi";
import { MdToday } from "react-icons/md";
import { type RouterOutputs, api } from "@/utils/api";

type Props = {
  eventId: string;
  manage?: boolean;
};

const EventCardId = ({ eventId, manage }: Props) => {
  const { data: event } = api.event.get.useQuery({ id: eventId });
  const date = event?.datetime ? new Date(event?.datetime) : new Date();
  const endTime = event?.datetime
    ? new Date(
        new Date(event?.datetime).getTime() + (event?.duration ?? 0) * 60000
      )
    : new Date();

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
        <Image
          src={event?.thumbnail ?? ""}
          alt={event?.title ?? ""}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-2 xs:w-3/5">
        <h5 className="text-base font-medium tracking-tight text-neutral-200 transition-all xs:text-sm sm:text-base lg:text-lg">
          {event?.title}
        </h5>

        <div className="m-0 flex flex-col items-start gap-1 p-0 text-left text-sm text-neutral-300 xs:text-xs sm:text-sm lg:text-base">
          <span className="flex items-center gap-1 sm:hidden">
            <MdToday />{" "}
            {date?.toLocaleString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-1">
            <BiTimeFive />
            {date?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            to{" "}
            {endTime?.toLocaleString("en-US", {
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
  event: RouterOutputs["event"]["getEvent"];
  manage?: boolean;
}) => {
  const date = event && !!event?.datetime ? event?.datetime : new Date();
  const endTime =
    event && !!event?.datetime
      ? new Date(event?.datetime.getTime() + (event?.duration ?? 0) * 60000)
      : new Date();

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
        <Image
          src={event?.thumbnail ?? ""}
          alt={event?.title ?? ""}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-2 xs:w-3/5">
        <h5 className="text-base font-medium tracking-tight text-neutral-200 transition-all xs:text-sm sm:text-base lg:text-lg">
          {event?.title}
        </h5>

        <div className="m-0 flex flex-col items-start gap-1 p-0 text-left text-sm text-neutral-300 xs:text-xs sm:text-sm lg:text-base">
          <span className="flex items-center gap-1 sm:hidden">
            <MdToday />{" "}
            {date?.toLocaleString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-1">
            <BiTimeFive />
            {date?.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            to{" "}
            {endTime?.toLocaleString("en-US", {
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
