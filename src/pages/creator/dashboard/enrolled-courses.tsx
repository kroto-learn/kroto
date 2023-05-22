import Head from "next/head";
import React from "react";
import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { DashboardLayout } from ".";
import Image from "next/image";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";

const Index = () => {
  const { data: enrollments, isLoading: enrollmentsLoading } =
    api.course.getEnrollments.useQuery();

  return (
    <>
      <Head>
        <title>Enrolled Courses | Dashboard</title>
      </Head>
      <div className="mb-10 ml-4 flex flex-col gap-4 px-4 py-8">
        <h1 className="text-xl text-neutral-200 sm:text-2xl">
          Enrolled Courses
        </h1>

        {enrollmentsLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {enrollments && enrollments?.length > 0 ? (
              <>
                <div className="my-2 flex flex-col gap-2">
                  {enrollments?.map((enrollment) => (
                    <EnrolledCourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                <div className="relative aspect-square w-40 object-contain">
                  <Image src="/empty/course_empty.svg" alt="empty" fill />
                </div>
                <p className="mb-2 text-neutral-400 text-center">
                  You have not enrolled in any course.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

Index.getLayout = DashboardLayout;

export default Index;
