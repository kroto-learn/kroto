import type { Course } from "interfaces/Course";
import Image from "next/image";
import React from "react";
import { HiArrowSmRight } from "react-icons/hi";
type Props = {
  course: Course;
  collapsed?: boolean;
};

const CourseCard = ({ course, collapsed }: Props) => {
  return (
    <div
      className={`flex gap-4 rounded-lg border border-neutral-700 bg-neutral-800 shadow transition-all duration-300 ${
        collapsed
          ? "h-28 w-full max-w-md items-center p-4 px-3"
          : "max-w-2xl p-10"
      }`}
    >
      <div
        className={`relative aspect-[16/10] object-cover transition-all duration-300
        ${collapsed ? "h-full" : ""}
        `}
      >
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className={`flex w-full flex-col ${collapsed ? "gap-3" : "gap-1"}`}>
        <h5
          className={`font-medium tracking-tight text-neutral-200 transition-all duration-300 ${
            collapsed ? "text-base" : "text-md"
          }`}
        >
          {course.title}
        </h5>
        <p
          className={`max-h-[4rem] overflow-y-hidden text-sm font-normal text-gray-400 transition-all duration-300 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {course.description}
        </p>
        <div className="flex w-full items-center justify-end gap-4">
          <p className={`text-green-500 ${collapsed ? "text-xs" : ""}`}>FREE</p>
          <a
            href="#"
            className={`group inline-flex items-center gap-1 rounded-md bg-pink-600 text-center font-medium text-neutral-200 transition-all duration-300 ${
              collapsed ? "px-2 py-1 text-xs" : "px-3  py-2 text-sm"
            }`}
          >
            Enroll now
            <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
