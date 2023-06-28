import { DashboardLayout } from ".";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import ImageWF from "@/components/ImageWF";

const EnrolledCourses = () => {
  const { data: enrollments, isLoading: enrollmentsLoading } =
    api.enrollmentCourse.getEnrollments.useQuery();
  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection
          delay={0.2}
          className="borde flex w-full max-w-4xl flex-col gap-4 rounded-xl sm:gap-4"
        >
          <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
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
                    <div className="flex max-h-[76vh] w-full flex-col items-start gap-4 overflow-y-scroll">
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
    </>
  );
};

export default EnrolledCourses;

EnrolledCourses.getLayout = DashboardLayout;
