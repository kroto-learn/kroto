import Image from "next/image";
import React from "react";
import type { CourseEvent } from "interfaces/CourseEvent";
import CalenderBox from "./CalenderBox";
import type { Creator } from "interfaces/Creator";
import Link from "next/link";
import { BiTimeFive } from "react-icons/bi";
import { MdToday } from "react-icons/md";

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
            ? `/creator/dashboard/event/${courseevent.id}`
            : `/event/${courseevent.id}`
          : `/course/${courseevent.id}`
      }
      className={`flex w-full cursor-pointer flex-col justify-center gap-4 rounded-xl p-3 transition-all hover:bg-neutral-700/50 xs:flex-row xs:items-center`}
    >
      {courseevent.datetime && (
        <div className="hidden sm:block">
          <CalenderBox datetime={courseevent.datetime} />
        </div>
      )}
      <div
        className={`relative aspect-[18/9] w-full object-cover transition-all xs:w-2/5`}
      >
        <Image
          src={courseevent.thumbnail}
          alt={courseevent.title}
          fill
          style={{ objectFit: "cover" }}
          className={collapsed ? "rounded-md" : "rounded-xl"}
        />
      </div>
      <div className="flex w-full flex-col items-start gap-2 xs:w-3/5">
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
        <h5 className="text-base font-medium tracking-tight text-neutral-200 transition-all xs:text-sm sm:text-base lg:text-lg">
          {courseevent.title}
        </h5>
        {/* <p
          className={`text-sm tracking-tight text-neutral-300 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {courseevent.ogdescription}
        </p> */}

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
