import Link from "next/link";
import { DashboardLayout } from "..";
import { PlusIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/utils/api";
import Image from "next/image";
import CourseCard from "@/components/CourseCard";

const Index = () => {
  const { data: courses, isLoading: couresesLoading } =
    api.course.getAll.useQuery();

  if (couresesLoading)
    return (
      <>
        <Head>
          <title>Courses | Dashboard</title>
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Courses | Dashboard</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection className="flex w-full items-center justify-between gap-4 sm:px-4">
          <h1 className="text-2xl text-neutral-200">Courses</h1>
          <Link
            href="/course/import"
            className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-xs font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:text-sm"
          >
            <PlusIcon className="w-5" /> Import Course
          </Link>
        </AnimatedSection>
        {courses && courses.length > 0 ? (
          <AnimatedSection delay={0.2} className="mt-8 flex w-full flex-col items-start gap-4">
            {courses?.map((course) => (
              <CourseCard course={course} key={course.id} manage />
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.2} className="flex w-full flex-col items-center justify-center text-center gap-2 p-4">
            <div className="relative aspect-square w-40 object-contain">
              <Image src="/empty/course_empty.svg" alt="empty" fill />
            </div>
            <p className="mb-2 text-sm text-neutral-400 sm:text-base text-center">
              You have not created any course yet.
            </p>
            <Link
              href="/course/import"
              className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
            >
              <PlusIcon className="w-5" /> Import Course
            </Link>
          </AnimatedSection>
        )}
      </div>
    </>
  );
};

export default Index;

Index.getLayout = DashboardLayout;
