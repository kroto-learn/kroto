import { Loader } from "@/components/Loader";
import YouTube from "react-youtube";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/router";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { PlayerLayout } from ".";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReactLinkify from "react-linkify";

const Index = () => {
  const router = useRouter();
  const { chapter_id, course_id } = router.query as {
    chapter_id: string;
    course_id: string;
  };

  const [player, setPlayer] = useState<YT.Player | null>(null);

  const { data: chapter, isLoading: chapterLoading } =
    api.courseChapter.get.useQuery({ id: chapter_id });

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id: course_id,
  });

  const { mutateAsync: updateCourseProgressMutation } =
    api.course.updateCourseProgress.useMutation();

  const { mutateAsync: updateChapterProgressMutation } =
    api.courseChapter.updateChapterProgress.useMutation();

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

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
      void updateCourseProgressMutation({
        courseId: course_id,
        lastChapterId: chapter_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter_id, course_id]);

  useEffect(() => {
    setProgress(0);
  }, [chapter_id]);

  useEffect(() => {
    if (player && progress && progress / player.getDuration() >= 0.8)
      void updateChapterProgressMutation(
        { chapterId: chapter_id },
        {
          onSuccess: () => {
            void ctx.course.get.invalidate();
          },
        }
      );

    const timer = () => {
      if (player)
        setProgress(
          progress + (progress >= player?.getDuration() || paused ? 0 : 1)
        );
    };

    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, paused]);

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

  const position = course.chapters.findIndex((ch) => ch.id === chapter.id);

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
              onStateChange={(event) => {
                if (event.data === YouTube.PlayerState.PAUSED) {
                  setPaused(true);
                } else {
                  setPaused(false);
                }
                if (player?.getCurrentTime())
                  setProgress(player?.getCurrentTime());
              }}
              onPause={() => setPaused(true)}
              onPlay={() => setPaused(false)}
              onReady={(e) => {
                if (e.target) setPlayer(e.target as YT.Player);
              }}
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

          <div className="w-full whitespace-pre-wrap p-6 text-sm">
            <ReactLinkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                  href={decoratedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-200 underline duration-150 hover:text-neutral-300"
                  key={key}
                >
                  {decoratedText}
                  <span className="text-xs">{"🔗"}</span>
                </a>
              )}
            >
              {chapter?.type === "YTVIDEO" && chapter?.description}
            </ReactLinkify>
          </div>
        </div>
      </div>
    </>
  );
};

Index.getLayout = PlayerLayout;

export default Index;
