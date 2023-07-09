import { Loader } from "@/components/Loader";
import YouTube from "react-youtube";
import { api } from "@/utils/api";

import ImageWF from "@/components/ImageWF";
import { useRouter } from "next/router";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { PlayerLayout } from ".";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import ReactLinkify from "react-linkify";
import { Checkbox, ConfigProvider, theme } from "antd";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { MixPannelClient } from "@/analytics/mixpanel";

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
    api.tracking.updateCourseProgress.useMutation();

  const { mutateAsync: updateChapterProgressMutation } =
    api.courseChapter.updateChapterProgress.useMutation();

  const { mutateAsync: markWatchedMutation } =
    api.courseChapter.markWatched.useMutation();

  const { mutateAsync: clearWatchedMutation } =
    api.courseChapter.clearWatched.useMutation();

  const { mutateAsync: trackLearningMutation } =
    api.tracking.trackLearning.useMutation();

  const session = useSession();

  const [progress, setProgress] = useState(0);
  const [stackedProgress, setStackedProgress] = useState(0);
  const [stackedProgress2, setStackedProgress2] = useState(0);
  const [fiveMinMixedToday, set5MinMixedToday] = useState(false);

  const [previousProgress, setPreviousProgress] = useState(0);

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
      origin: typeof window !== "undefined" ? window.location.hostname : 0,
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
    setStackedProgress(0);
    setPreviousProgress(0);
    setSeekedInit(false);
    setVideoLoaded(false);
  }, [chapter_id]);

  useEffect(() => {
    set5MinMixedToday(false);
  }, [course_id]);

  useEffect(() => {
    if (
      player &&
      progress &&
      progress / player.getDuration() >= 0.9 &&
      !(chapter?.chapterProgress && chapter?.chapterProgress?.watched) &&
      chapter_id === chapter?.id
    ) {
      void markWatchedMutation(
        { chapterId: chapter_id },
        {
          onSuccess: () => {
            MixPannelClient.getInstance().markLessonAsComplete({
              courseId: course_id,
              userId: session.data?.user?.id ?? "",
              lessonId: chapter_id,
            });
            void ctx.course.get.invalidate();
            void ctx.courseChapter.get.invalidate();
          },
        }
      );
    }

    const timer = () => {
      if (player) {
        setProgress(
          progress + (progress >= player?.getDuration() || paused ? 0 : 1)
        );

        if (!fiveMinMixedToday)
          setStackedProgress2(
            stackedProgress2 +
              (progress >= player?.getDuration() || paused ? 0 : 1)
          );

        if (!paused && stackedProgress > 0) {
          setVideoLoaded(true);
        }

        if (stackedProgress >= 60) {
          if (
            session.data?.user.id &&
            course &&
            course.id &&
            chapter &&
            chapter.id
          )
            void trackLearningMutation({
              userId: session.data?.user.id,
              courseId: course?.id,
              chapterId: chapter?.id,
            });

          if (chapter && chapter.id)
            void updateChapterProgressMutation({
              chapterId: chapter.id,
              videoProgress: progress + 1,
            });

          setStackedProgress(0);
        } else {
          if (!(progress >= player?.getDuration() || paused))
            setStackedProgress(
              stackedProgress +
                (progress >= player?.getDuration() || paused ? 0 : 1)
            );
        }
      }
    };

    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    progress,
    paused,
    stackedProgress,
    setStackedProgress,
    chapter,
    course,
    chapter_id,
  ]);

  useEffect(() => {
    if (stackedProgress2 > 5 * 60) {
      setStackedProgress2(0);
      set5MinMixedToday(true);
      MixPannelClient.getInstance().lessonWatchedForFiveMinutes({
        courseId: course_id,
        userId: session.data?.user?.id ?? "",
      });

      localStorage.setItem(
        `5minLWMixed-${course_id}`,
        JSON.stringify({
          courseId: course_id,
          userId: session.data?.user?.id ?? "",
          date: new Date().getTime(),
        })
      );
    }
  }, [stackedProgress2, course_id, session]);

  useEffect(() => {
    const fiveMinLWMixedS = localStorage.getItem(`5minLWMixed-${course_id}`);

    const fiveMinLWMixed = fiveMinLWMixedS
      ? (JSON.parse(fiveMinLWMixedS) as {
          courseId: string;
          userId: string;
          date: number;
        })
      : undefined;

    if (
      fiveMinLWMixed &&
      new Date(fiveMinLWMixed.date).getDate() === new Date().getDate()
    )
      set5MinMixedToday(true);
  }, [course_id]);

  useEffect(() => {
    if (session.status === "authenticated")
      MixPannelClient.getInstance().coursePlayed({
        courseId: course_id,
        userId: session.data?.user?.id ?? "",
      });
  }, [course_id, session]);

  const [watchChecked, setWatchChecked] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [seekedInit, setSeekedInit] = useState(false);

  useEffect(() => {
    if (chapter) {
      setWatchChecked(
        !!chapter?.chapterProgress && chapter?.chapterProgress?.watched
      );
      if (player && videoLoaded && !seekedInit) {
        if (chapter?.chapterProgress?.videoProgress)
          setPreviousProgress(chapter?.chapterProgress?.videoProgress);
        else
          MixPannelClient.getInstance().lessonStarted({
            courseId: course_id,
            userId: session.data?.user?.id ?? "",
            lessonId: chapter_id,
          });
        setSeekedInit(true);
      }
    }
  }, [
    chapter,
    player,
    videoLoaded,
    seekedInit,
    course_id,
    chapter_id,
    session,
  ]);

  if (chapterLoading || courseLoading || !chapter_id || !course_id)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Head>
          <title>Couse | Kroto</title>
        </Head>
        <Loader size="lg" />
      </div>
    );

  if (!chapter || !course)
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

      <div className="flex w-full flex-col items-start gap-2 pr-4">
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
              onPause={() => {
                setPaused(true);
              }}
              onPlay={() => setPaused(false)}
              onReady={(e) => {
                if (e.target) setPlayer(e.target as YT.Player);
              }}
              onEnd={() => {
                MixPannelClient.getInstance().lessonCompleted({
                  courseId: course_id,
                  userId: session.data?.user?.id ?? "",
                  lessonId: chapter_id,
                });

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

                      if (
                        !!chapter.chapterProgress &&
                        chapter?.chapterProgress?.watched
                      )
                        void clearWatchedMutation(
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
                        void markWatchedMutation(
                          {
                            chapterId: chapter.id,
                          },
                          {
                            onSuccess: () => {
                              MixPannelClient.getInstance().markLessonAsComplete(
                                {
                                  courseId: course_id,
                                  userId: session.data?.user?.id ?? "",
                                  lessonId: chapter_id,
                                }
                              );
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
                      MixPannelClient.getInstance().previousLessonClicked({
                        courseId: course_id,
                        userId: session.data?.user?.id ?? "",
                        lessonId: chapter_id,
                      });

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
                      MixPannelClient.getInstance().nextLessonClicked({
                        courseId: course_id,
                        userId: session.data?.user?.id ?? "",
                        lessonId: chapter_id,
                      });

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
          href={`${
            course?.creator
              ? `/${course?.creator?.creatorProfile ?? ""}`
              : `https://www.youtube.com/${course?.ytChannelId ?? ""}`
          }`}
          target={!course?.creator ? "_blank" : undefined}
          className="group mt-2 flex items-center gap-2"
          onClick={() => {
            MixPannelClient.getInstance().creatorProfileClickedFromCourse({
              courseId: course_id,
              userId: session.data?.user?.id ?? "",
              creatorId: course?.creatorId ?? "unclaimed",
            });
          }}
        >
          <ImageWF
            src={course?.creator?.image ?? course?.ytChannelImage ?? ""}
            alt={course?.creator?.name ?? course?.ytChannelName ?? ""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="font-medium text-neutral-300 duration-150 group-hover:text-neutral-200">
            {course?.creator?.name ?? course?.ytChannelName ?? ""}
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
                  className="line-clamp-1 overflow-hidden text-ellipsis font-medium text-neutral-200 underline duration-150 hover:text-neutral-300"
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
      <SeekToModal
        prevProg={previousProgress}
        onYes={() => {
          if (player && videoLoaded && previousProgress > 0) {
            player?.seekTo(previousProgress, true);
            player?.playVideo();
          }
          setPreviousProgress(0);
        }}
        onLoad={() => {
          if (player && videoLoaded) {
            player?.pauseVideo();
          }
        }}
        onClose={() => {
          setPreviousProgress(0);
          if (player && videoLoaded) player?.playVideo();
        }}
      />
    </>
  );
};

export function SeekToModal({
  onYes,
  onLoad,
  onClose,
  prevProg,
}: {
  onYes: () => void;
  onLoad: () => void;
  onClose: () => void;
  prevProg: number;
}) {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(prevProg);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const formattedTime =
    hours === "00" ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;

  const isOpen = prevProg > 0;

  useEffect(() => {
    if (prevProg > 0) onLoad();
  }, [prevProg, onLoad]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-neutral-800 p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-end">
                      <button
                        onClick={onClose}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 outline-none hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="space-y-6 p-4">
                    <p className="text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                      You left this chapter at{" "}
                      <span className="font-bold tracking-wider text-pink-600">
                        {formattedTime}
                      </span>
                      , do you want to continue from there?
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg bg-neutral-500 px-5 py-2.5 text-center text-sm font-bold duration-300 hover:bg-neutral-600  hover:text-neutral-200"
                    >
                      No, thank you
                    </button>
                    <button
                      type="button"
                      onClick={onYes}
                      className="flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-center text-sm font-bold duration-300 hover:bg-pink-600  hover:text-neutral-200"
                    >
                      Yeah, sure
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

Index.getLayout = PlayerLayout;

export default Index;
