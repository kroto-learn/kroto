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
      className={`flex gap-4 rounded-lg border border-neutral-700 bg-neutral-800 p-3 shadow transition-all duration-300 ${
        collapsed ? "w-full max-w-lg" : "max-w-2xl"
      }`}
    >
      <div
        className={`relative aspect-[16/10] object-cover transition-all duration-300
        ${collapsed ? "w-40" : "w-72"}
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
      <div className="w-full">
        <h5
          className={`mb-2 font-bold tracking-tight text-neutral-200 transition-all duration-300 ${
            collapsed ? "text-md" : "text-lg"
          }`}
        >
          {course.title}
        </h5>
        <p
          className={`duration-30 mb-3 max-h-[4rem] overflow-y-hidden text-sm font-normal text-gray-400 transition-all ${
            collapsed ? "hidden" : ""
          }`}
        >
          {course.description}
        </p>
        <div className="flex w-full items-center justify-end gap-6">
          <p className="text-green-500">FREE</p>
          <a
            href="#"
            className={`group inline-flex items-center gap-[0.15rem] rounded-lg bg-pink-600 px-3 py-2 text-center font-medium text-neutral-200 transition-all duration-300 ${
              collapsed ? "text-xs" : "text-sm"
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
