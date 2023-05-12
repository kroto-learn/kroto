import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { PlayIcon } from "@heroicons/react/20/solid";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";

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

const PlayerLayoutR = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { course_id, chapter_id } = router.query as {
    course_id: string;
    chapter_id: string;
  };
  const { data: course } = api.course.getCourse.useQuery({ id: course_id });

  if (course instanceof TRPCError || !course) return <></>;

  return (
    <div className="flex min-h-screen w-full gap-3 p-4">
      {children}
      <div className="sticky top-4 flex h-[calc(100vh-2rem)] w-full max-w-sm flex-col rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur-sm">
        <div className="flex w-full flex-col gap-2 border-b border-neutral-700 p-4 px-6">
          <h3 className="text-lg font-medium">{course?.title}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <p>{course.creator.name}</p> •{" "}
            <p>{course.courseBlocks.length} Chapters</p>
          </div>
        </div>
        <div className="flex max-h-[calc(100vh-8rem)] w-full flex-col overflow-auto">
          {course.courseBlocks.map((chapter, idx) => (
            <Link
              href={`/course/play/${course?.id}/${chapter?.id}`}
              className="flex w-full max-w-lg items-center gap-3 border-b border-neutral-700 bg-transparent p-2 px-4 backdrop-blur-sm duration-150 hover:bg-neutral-200/10"
              key={chapter?.id}
            >
              <p className={`text-xs text-neutral-300`}>
                {chapter_id === chapter?.id ? (
                  <PlayIcon className="w-3 text-pink-500" />
                ) : (
                  <div className="aspect-square w-3">{idx + 1}</div>
                )}
              </p>
              <div
                className={`relative aspect-video w-40 overflow-hidden rounded-lg `}
              >
                <Image
                  src={chapter?.thumbnail ?? ""}
                  alt={chapter?.title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex h-full w-full flex-col items-start gap-1">
                <h5 className={`text-sm font-medium`}>{chapter?.title}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export function PlayerLayout(page: ReactNode) {
  return <PlayerLayoutR>{page}</PlayerLayoutR>;
}

Index.getLayout = PlayerLayout;

export default Index;
