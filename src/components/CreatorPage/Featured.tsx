import type { Creator } from "interfaces/Creator";
import React from "react";
import CourseCard from "../CourseCard";

type Props = {
  creator: Creator;
  collapsed: boolean;
};

const Featured = ({ creator, collapsed }: Props) => {
  return (
    <div
      className={`flex w-full flex-col items-end gap-2 ${
        collapsed
          ? ""
          : "rounded-lg border border-neutral-700 bg-neutral-800 p-4 backdrop-blur-sm"
      }`}
    >
      {/* <p className="text-base font-medium uppercase text-gray-300">
        {"✨ "}FEATURED
      </p> */}
      <div
        className={`flex w-full items-center gap-6 transition-all duration-300 ${
          collapsed ? "flex-col" : ""
        }`}
      >
        {creator.courses.map((course) =>
          course.featured ? (
            <CourseCard
              collapsed={collapsed}
              key={course.title}
              course={course}
            />
          ) : (
            <></>
          )
        )}
        {creator.events.map((event) =>
          event.featured ? (
            <CourseCard
              collapsed={collapsed}
              key={event.title}
              course={event}
            />
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
};

export default Featured;
