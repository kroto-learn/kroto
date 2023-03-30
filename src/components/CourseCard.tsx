import type { Course } from "interfaces/Course";
import Image from "next/image";
import React from "react";
type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  return (
    <div className="max-w-[20rem] rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-neutral-800">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg object-cover">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {course.title}
          </h5>
        </a>
        <p className="mb-3 max-h-[4rem] overflow-y-hidden text-sm font-normal text-gray-700 dark:text-gray-400">
          {course.description}
        </p>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Enroll now
          </a>
          <p className="text-green-500">FREE</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
