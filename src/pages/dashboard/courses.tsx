import AnimatedSection from "@/components/AnimatedSection";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
import ImageWF from "@/components/ImageWF";
import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import { api } from "@/utils/api";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Chart as ChartJS, ArcElement, Tooltip as TooltipC } from "chart.js";
import Link from "next/link";

const Index = () => {
  ChartJS.register(ArcElement, TooltipC);

  const { data: enrollments, isLoading: enrollmentsLoading } =
    api.enrollmentCourse.getEnrollments.useQuery();

  return (
    <Layout>
      <div className="flex w-full flex-col items-center p-4">
        <div className="flex w-full max-w-4xl items-start">
          <Link
            href="/dashboard"
            className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-200 sm:text-sm"
          >
            <ArrowLeftIcon className="w-4" /> Back to dashboard
          </Link>
        </div>
        <AnimatedSection className="mb-10 mt-4 w-full max-w-4xl flex-col gap-2">
          <h1 className="mb-3 text-lg font-medium text-neutral-200 sm:text-2xl">
            Enrolled Courses
          </h1>
          <div className="flex w-full flex-col items-center">
            {enrollmentsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                {enrollments && enrollments?.length > 0 ? (
                  <>
                    <div className="my-2 flex w-full flex-col items-start gap-4">
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
                      <ImageWF src="/empty/course_empty.svg" alt="empty" fill />
                    </div>
                    <p className="mb-2 text-center text-neutral-400 sm:text-left">
                      You have not enrolled in any course.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default Index;
