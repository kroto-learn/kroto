import CalenderBox from "@/components/CalenderBox";
import { getEvents } from "mock/getEvents";
import Image from "next/image";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { SiGooglemeet } from "react-icons/si";

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

  const date = event && event.datetime ? new Date(event.datetime) : new Date();

  const endTime =
    event && event.datetime
      ? new Date(new Date("2023-06-22T01:30:00.000-05:00").getTime() + 3600000)
      : new Date();

  if (event)
    return (
      <div className="flex w-full max-w-3xl items-start gap-8 rounded-xl bg-neutral-800 p-4">
        <div className="flex flex-col items-start gap-4">
          <div
            className={`relative aspect-[18/9] w-full object-cover transition-all sm:w-[12rem] md:w-[16rem]`}
          >
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl"
            />
          </div>
          <button
            className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
          >
            <FiEdit2 className="" />
            Edit Event
          </button>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-neutral-200">When & Where</h3>
            <div className="flex gap-2">
              <CalenderBox datetime="2023-06-22T01:30:00.000-05:00" />
              <p className="text-left text-sm  font-medium text-neutral-300">
                {date?.toLocaleString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                <br />
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
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />{" "}
              <p>Google Meet</p>
            </div>
          </div>
        </div>
      </div>
    );
  else return <></>;
}
