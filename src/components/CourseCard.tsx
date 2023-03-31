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
      className={`flex gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow transition-all duration-300 dark:border-gray-300/10 dark:bg-[#27272A] ${
        collapsed ? "w-[28rem]" : "max-w-[20rem] flex-col"
      }`}
    >
      <div
        className={`relative aspect-[16/10] object-cover transition-all duration-300
        ${collapsed ? "w-40" : " w-full"}
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
          className={`mb-2 font-bold tracking-tight text-gray-900 transition-all duration-300 dark:text-white ${
            collapsed ? "text-lg" : "text-lg"
          }`}
        >
          {course.title}
        </h5>
        <p
          className={`mb-3 max-h-[4rem] overflow-y-hidden text-sm font-normal text-gray-700 transition-all duration-300 dark:text-gray-400 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {course.description}
        </p>
        <div className="flex w-full items-center justify-end gap-6">
          <p className="text-green-500">FREE</p>
          <a
            href="#"
            className={`group inline-flex items-center gap-[0.15rem] rounded-lg bg-[#C01A62] px-3 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-[#C01A62] focus:bg-[#C01A62] focus:outline-none focus:ring-4 dark:bg-[#C01A62] ${
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
