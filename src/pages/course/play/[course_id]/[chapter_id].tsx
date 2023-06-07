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
import { Checkbox, ConfigProvider, theme } from "antd";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

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

  const [watchChecked, setWatchChecked] = useState(false);

  const { mutateAsync: deleteChapterProgressMutation } =
    api.courseChapter.deleteChapterProgress.useMutation();

  useEffect(() => {
    if (!(chapter instanceof TRPCError) && chapter)
      setWatchChecked(!!chapter?.chapterProgress);
  }, [chapter]);

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
  const { darkAlgorithm } = theme;

  return (
    <>
      <Head>
        <title>
          Ch. {chapter.position + 1} | {course.title}
        </title>
      </Head>
      <div className="flex w-full flex-col items-start gap-2">
        {chapter.type !== "TEXT" ? (
          <div className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg border border-neutral-700">
            <YouTube
              className="bottom-0 left-0 right-0 top-0 aspect-video h-full w-full border-b border-neutral-700"
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
            <div className="flex w-full items-center justify-between gap-4 p-2 px-4 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <ConfigProvider
                  theme={{
                    algorithm: darkAlgorithm,
                    token: {
                      colorPrimary: "#16a34a",
                    },
                  }}
                >
                  <Checkbox
                    checked={watchChecked}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWatchChecked(!watchChecked);

                      if (!!chapter.chapterProgress)
                        void deleteChapterProgressMutation(
                          {
                            chapterId: chapter.id,
                          },
                          {
                            onSuccess: () => {
                              void ctx.course.get.invalidate();
                              void ctx.courseChapter.get.invalidate();
                            },
                          }
                        );
                      else
                        void updateChapterProgressMutation(
                          {
                            chapterId: chapter.id,
                          },
                          {
                            onSuccess: () => {
                              void ctx.course.get.invalidate();
                              void ctx.courseChapter.get.invalidate();
                            },
                          }
                        );
                    }}
                  />
                </ConfigProvider>
                <p className="text-xs sm:text-base">Mark as watched</p>
              </div>
              <div className="flex items-center gap-2 text-sm dark:border-neutral-600">
                {position > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      void router.push(
                        `/course/play/${course_id}/${
                          course?.chapters[position - 1]?.id ?? ""
                        }`
                      );
                    }}
                    className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 p-1 px-2 text-center text-xs font-semibold text-neutral-400 duration-300 hover:text-neutral-200 active:scale-95 disabled:hidden sm:px-3 sm:text-sm"
                  >
                    <ChevronLeftIcon className="w-4" /> Previous
                  </button>
                ) : (
                  <></>
                )}
                {position < course.chapters.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      void router.push(
                        `/course/play/${course_id}/${
                          course?.chapters[position + 1]?.id ?? ""
                        }`
                      );
                    }}
                    className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 p-1 px-2 text-center text-xs font-semibold text-neutral-400 duration-300 hover:text-neutral-200 active:scale-95 disabled:hidden sm:px-3 sm:text-sm"
                  >
                    Next <ChevronRightIcon className="w-4" />
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <h3 className="mt-2 text-lg font-medium">
          <span className="m-0 mr-2 rounded border border-pink-500/30 bg-pink-500/10 p-1 text-sm font-bold text-pink-500">
            Ch. {chapter.position + 1}{" "}
          </span>
          {chapter?.title}
        </h3>
        <Link
          href={`/${chapter?.creator.creatorProfile ?? ""}`}
          className="group mt-2 flex items-center gap-2"
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
