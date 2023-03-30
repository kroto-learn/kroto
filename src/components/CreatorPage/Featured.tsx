import type { Creator } from "interfaces/Creator";
import React from "react";
import CourseCard from "../CourseCard";

type Props = {
  creator: Creator;
};

const Featured = ({ creator }: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-400/30 bg-neutral-700 p-4 backdrop-blur-sm">
      <p className="text-base font-medium uppercase text-gray-300">
        {"✨ "}FEATURED
      </p>
      <div className="flex items-center gap-2">
        {creator.courses.map((course) =>
          course.featured ? (
            <CourseCard key={course.title} course={course} />
          ) : (
            <></>
          )
        )}
        {creator.events.map((event) =>
          event.featured ? (
            <CourseCard key={event.title} course={event} />
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
};

export default Featured;
