import Link from "next/link";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/utils/api";
import ImageWF from "@/components/ImageWF";
import CourseCard from "@/components/CourseCard";
import { isAdmin } from "@/server/helpers/admin";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TRPCError } from "@trpc/server";
import { AdminDashboardLayout } from "..";

const Index = () => {
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: courses, isLoading: couresesLoading } =
    api.course.getAllAdmin.useQuery({ searchQuery: debouncedQuery });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>Courses | Dashboard</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection className="flex w-full items-center justify-between gap-4 sm:px-4">
          <h1 className="text-2xl text-neutral-200">Courses</h1>
          <div className="flex items-center gap-2">
            {isAdmin(session?.data?.user?.email ?? "") ? (
              <Link
                href="/course/admin-import"
                className="flex items-center gap-1 rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 duration-300 hover:bg-green-500 hover:text-neutral-200"
              >
                <PlusIcon className="w-5" /> Admin Import Course
              </Link>
            ) : (
              <></>
            )}
          </div>
        </AnimatedSection>
        {searchOpen ? (
          <div className="relative flex items-center">
            <input
              placeholder="Search course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="peer w-full rounded-lg bg-pink-500/10 px-3 py-2 pl-8 font-medium text-neutral-200   outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
            />
            <div className="absolute right-4">{false && <Loader />}</div>

            <MagnifyingGlassIcon className="absolute ml-2 w-4 text-pink-500/50 duration-300 peer-hover:text-pink-500/80 peer-focus:text-pink-500" />
          </div>
        ) : (
          <MagnifyingGlassIcon
            onClick={() => setSearchOpen(true)}
            className="my-3 ml-2 w-4 cursor-pointer text-pink-500 duration-300"
          />
        )}
        {couresesLoading ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : !(courses instanceof TRPCError) && courses && courses.length > 0 ? (
          <AnimatedSection
            delay={0.2}
            className="flex max-h-[76vh] w-full flex-col items-start gap-4 overflow-y-scroll"
          >
            {courses?.map((course) => (
              <CourseCard course={course} key={course.id} admin />
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection
            delay={0.2}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 text-center"
          >
            <div className="relative aspect-square w-40 object-contain">
              <ImageWF src="/empty/course_empty.svg" alt="empty" fill />
            </div>
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
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

Index.getLayout = AdminDashboardLayout;
