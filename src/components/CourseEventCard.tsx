import Image from "next/image";
import React from "react";
import DateTime from "./DateTime";
import type { CourseEvent } from "interfaces/CourseEvent";
import CalenderBox from "./CalenderBox";
import type { Creator } from "interfaces/Creator";
import Link from "next/link";

type Props = {
  courseevent: CourseEvent;
  collapsed?: boolean;
  creator?: Creator;
  manage?: boolean;
};

const CourseEventCard = ({
  courseevent,
  collapsed,
  creator,
  manage,
}: Props) => {
  return (
    <Link
      href={
        courseevent.datetime
          ? manage
            ? `creator/dashboard/event/${courseevent.id}`
            : `/event/${courseevent.id}`
          : `/course/${courseevent.id}`
      }
      className={`flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-700 bg-neutral-800 shadow transition-all hover:border-neutral-600  ${
        collapsed
          ? "h-16 min-w-[24rem] max-w-lg items-center p-2 px-3"
          : "max-w-full flex-col p-3 sm:flex-row"
      }`}
    >
      {courseevent.datetime && <CalenderBox datetime={courseevent.datetime} />}
      <div
        className={`relative aspect-[18/9] object-cover transition-all 
        ${collapsed ? "my-12 h-full" : "w-full sm:w-[12rem] md:w-[16rem]"}
        `}
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
        {creator && (
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
        )}
        <h5
          className={`font-medium tracking-tight text-neutral-200 transition-all  ${
            collapsed ? "text-xs" : "text-lg"
          }`}
        >
          {courseevent.title}
        </h5>
        <p
          className={`text-sm tracking-tight text-neutral-300 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {courseevent.ogdescription}
        </p>

        {courseevent.datetime && courseevent.duration ? (
          <DateTime
            datetime={courseevent.datetime}
            duration={courseevent.duration}
          />
        ) : (
          <></>
        )}
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
