import Image from "next/image";
import React from "react";
import type { CourseEvent } from "interfaces/CourseEvent";
import CalenderBox from "./CalenderBox";
import type { Creator } from "interfaces/Creator";
import Link from "next/link";
import { BiTimeFive } from "react-icons/bi";

type Props = {
  courseevent: CourseEvent;
  collapsed?: boolean;
  creator?: Creator;
  manage?: boolean;
};

const CourseEventCard = ({ courseevent, collapsed, manage }: Props) => {
  const date = new Date(courseevent.datetime);
  const endTime = new Date(
    new Date(courseevent.datetime).getTime() + courseevent.duration * 60000
  );

  return (
    <Link
      href={
        courseevent.datetime
          ? manage
            ? `creator/dashboard/event/${courseevent.id}`
            : `/event/${courseevent.id}`
          : `/course/${courseevent.id}`
      }
      className={`flex max-w-full cursor-pointer flex-col items-center gap-4 rounded-xl p-3 transition-all hover:bg-neutral-800 sm:flex-row`}
    >
      {courseevent.datetime && <CalenderBox datetime={courseevent.datetime} />}
      <div
        className={`relative aspect-[18/9] w-full object-cover transition-all sm:w-[8rem] md:w-[12rem]`}
      >
        <Image
          src={courseevent.thumbnail}
          alt={courseevent.title}
          fill
          style={{ objectFit: "cover" }}
          className={collapsed ? "rounded-md" : "rounded-xl"}
        />
      </div>
      <div className="flex w-1/2 flex-col items-start gap-2">
        {/* {creator && (
          <div className="flex items-center gap-2">
            <div
              className={`relative aspect-square w-4 overflow-hidden rounded-full`}
            >
              <Image src={creator.image_url} alt={creator.name} fill />
            </div>
            <p
              className={`text-xs text-neutral-300 transition-all  ${
                collapsed ? "hidden" : ""
              }`}
            >
              Hosted by {creator.name}
            </p>
          </div>
        )} */}
        <h5
          className={`text-lg font-medium tracking-tight text-neutral-200 transition-all`}
        >
          {courseevent.title}
        </h5>
        {/* <p
          className={`text-sm tracking-tight text-neutral-300 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {courseevent.ogdescription}
        </p> */}

        <p className="m-0 flex items-center gap-3 p-0 text-left text-sm text-neutral-300">
          {/* <span className="flex items-center gap-1">
            <IoTodayOutline />{" "}
            {date?.toLocaleString("en-US", {
              weekday: "long",
            })}
          </span> */}
          <span className="flex items-center gap-1">
            <BiTimeFive className="mt-[0.1rem]" />
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
        </p>

        {/* <div className="flex items-center gap-4">
            <p className={`text-green-500/70 ${collapsed ? "text-xs" : ""}`}>
              FREE
            </p>
            <a
              href="#"
              className={`group inline-flex items-center gap-[0.15rem] rounded-md bg-pink-600 text-center font-medium text-neutral-200 transition-all duration-300 ${
                collapsed ? "px-2 py-1 text-xs" : "px-3  py-2 text-sm"
              }`}
            >
              Enroll now
              <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
            </a>
          </div> */}
      </div>
    </Link>
  );
};

export default CourseEventCard;
