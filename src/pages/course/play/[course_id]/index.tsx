import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();
  const { course_id } = router.query as { course_id: string };
  const { data: course } = api.course.getCourse.useQuery({ id: course_id });

  useEffect(() => {
    if (
      !(course instanceof TRPCError) &&
      course &&
      course.courseBlocks.length > 0
    )
      void router.push(
        `/course/play/${course_id}/${course.courseBlocks[0]?.id ?? ""}`
      );
  }, [course, course_id, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader size="lg" />
    </div>
  );
};
export default Index;
