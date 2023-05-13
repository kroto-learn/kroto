import { Loader } from "@/components/Loader";
import YouTube from "react-youtube";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/router";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { PlayerLayout } from ".";
import { useEffect } from "react";
import Link from "next/link";

const Index = () => {
  const router = useRouter();
  const { chapter_id, course_id } = router.query as {
    chapter_id: string;
    course_id: string;
  };
  const { data: chapter, isLoading: chapterLoading } =
    api.courseChapter.get.useQuery({ id: chapter_id });

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id: course_id,
  });

  const { mutateAsync: updateCourseProgressMutation } =
    api.course.updateCourseProgress.useMutation();

  const { mutateAsync: updateChapterProgressMutation } =
    api.courseChapter.updateChapterProgress.useMutation();

  const ctx = api.useContext();

  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      origin: typeof window !== "undefined" ? window.location.origin : 0,
      showinfo: 0,
    },
  };

  useEffect(() => {
    if (chapter_id && course_id) {
      console.log("ran twice");
      void updateCourseProgressMutation({
        courseId: course_id,
        lastChapterId: chapter_id,
      });

      void updateChapterProgressMutation(
        {
          chapterId: chapter_id,
        },
        {
          onSuccess: () => {
            void ctx.course.get.invalidate();
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter_id, course_id]);

  if (chapterLoading || courseLoading || !chapter_id || !course_id)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Head>
          <title>Couse | Kroto</title>
        </Head>
        <Loader size="lg" />
      </div>
    );

  if (
    chapter instanceof TRPCError ||
    !chapter ||
    course instanceof TRPCError ||
    !course
  )
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1>Chapter not found!</h1>
      </div>
    );

  const position = course.chapters.findIndex(
    (chapter) => chapter.id === chapter.id
  );

  return (
    <>
      <Head>
        <title>
          Ch. {chapter.position + 1} | {course.title}
        </title>
      </Head>
      <div className="flex w-full flex-col items-start gap-2">
        {chapter.type !== "TEXT" ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-700">
            <YouTube
              className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
              videoId={chapter?.ytId ?? ""}
              opts={youtubeOpts}
              onEnd={() => {
                if (position < course.chapters.length - 1)
                  void router.push(
                    `/course/play/${course_id}/${
                      course.chapters[position + 1]?.id ?? ""
                    }`
                  );
              }}
            />
          </div>
        ) : (
          <></>
        )}
        <h3 className="mx-4 mt-2 text-lg font-medium">{chapter?.title}</h3>
        <Link
          href={`/${chapter?.creator.creatorProfile ?? ""}`}
          className="group mx-4 mt-2 flex items-center gap-2"
        >
          <Image
            src={chapter?.creator?.image ?? ""}
            alt={chapter?.creator?.name}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="font-medium text-neutral-300 duration-150 group-hover:text-neutral-200">
            {chapter?.creator?.name}
          </p>
        </Link>
        <div className="mt-4 flex w-full flex-col rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur-sm">
          <div className="flex w-full items-center gap-2 border-b border-neutral-700 p-2 px-6">
            <DocumentTextIcon className="w-4" />
            <h4 className="font-medium uppercase tracking-wider">
              Description
            </h4>
          </div>
          <p className="w-full whitespace-pre-wrap p-6">
            {chapter?.type === "YTVIDEO" && chapter?.description}
          </p>
        </div>
      </div>
    </>
  );
};

Index.getLayout = PlayerLayout;

export default Index;
