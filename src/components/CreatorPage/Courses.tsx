import type { Course } from "interfaces/Course";
import React from "react";
import CourseCard from "../CourseCard";

type Prop = {
  courses: Course[];
};

const Courses = ({ courses }: Prop) => {
  return (
    <div className="z-[0] mb-8 mt-[30rem] flex w-full max-w-7xl flex-col justify-start gap-8">
      <h2 className="text-3xl text-neutral-200">Courses</h2>
      <div className="flex flex-wrap gap-12">
        {courses.map((course) => (
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
