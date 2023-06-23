import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import {
  PlayIcon,
  CheckIcon,
  ArrowLeftIcon,
  ShareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { type Chapter, type ChapterProgress } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Checkbox, ConfigProvider, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState, useRef, Fragment } from "react";
import { Chart as ChartJS, ArcElement, Tooltip as TooltipC } from "chart.js";
import { Pie } from "react-chartjs-2";
import dynamic from "next/dynamic";
import { getCalApi } from "@calcom/embed-react";
import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { MixPannelClient } from "@/analytics/mixpanel";
const ShareCourseModal = dynamic(
  () => import("@/components/ShareCourseModal"),
  {
    ssr: false,
  }
);
// import ShareCourseModal from "@/components/ShareCourseModal";

const Index = () => {
  const router = useRouter();
  const { course_id, chapter_id } = router.query as {
    course_id: string;
    chapter_id?: string;
  };
  const { data: course } = api.course.get.useQuery({ id: course_id });

  useEffect(() => {
    if (
      !(course instanceof TRPCError) &&
      course &&
      course?.chapters?.length > 0 &&
      !chapter_id
    ) {
      const lastChIdx = course?.chapters?.findIndex(
        (ch) => ch.id === course?.courseProgress?.lastChapterId
      );
      const nextUnwatchedCh = course?.chapters
        ?.slice(lastChIdx !== -1 ? lastChIdx : 0)
        .find((ch) => !(!!ch?.chapterProgress && ch?.chapterProgress?.watched));

      const prevUnwatchedCh = course?.chapters
        ?.slice(0, lastChIdx !== -1 ? lastChIdx : 0)
        .find((ch) => !(!!ch?.chapterProgress && ch?.chapterProgress?.watched));

      const chToPlay =
        nextUnwatchedCh?.id ?? prevUnwatchedCh?.id ?? course?.chapters[0]?.id;

      void router.replace(`/course/play/${course_id}/${chToPlay ?? ""}`);
    }
  }, [course, course_id, router, chapter_id]);

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
  const { data: course, isLoading: courseLoading } = api.course?.get.useQuery({
    id: course_id,
  });
  const { data: isEnrolled, isLoading: isEnrolledLoading } =
    api.course.isEnrolled.useQuery({ courseId: course_id });
  const [sideDrawerCollapsed, setSideDrawerCollapsed] = useState(false);
  const chaptersNavRef = useRef<HTMLDivElement | null>(null);
  const [navbarScrollInit, setNavbarScrollInit] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (
      !isEnrolledLoading &&
      !isEnrolled &&
      !courseLoading &&
      !(course instanceof TRPCError) &&
      session.data?.user.id !== course?.creatorId
    )
      void router.replace("/");
  }, [isEnrolled, isEnrolledLoading, router, course, session, courseLoading]);

  useEffect(() => {
    //TODO: scroll to chapter link, this doesn't work
    if (chapter_id && chaptersNavRef.current && !!course && !navbarScrollInit) {
      setNavbarScrollInit(true);
      // const buttonToScrollTo = chaptersNavRef.current.querySelector(
      //   `#${chapter_id}`
      // );

      // #1st approach
      // if (buttonToScrollTo)
      //   buttonToScrollTo.scrollIntoView({ block: "start", inline: "nearest" });

      // #2nd approach
      // if (buttonToScrollTo)
      //   chaptersNavRef.current.scrollTop = (
      //     buttonToScrollTo as HTMLDivElement
      //   ).offsetTop;
    }
  }, [chapter_id, course, navbarScrollInit]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) setSideDrawerCollapsed(true);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    void (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#ec4899" } },
        theme: "dark",
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  const [shareModal, setShareModal] = useState(false);

  if (course instanceof TRPCError || !course) return <></>;

  const chaptersWatched = course.chapters?.filter(
    (ch) => !!ch?.chapterProgress && ch?.chapterProgress?.watched
  )?.length;

  const minutesWatched = course?.chapters
    ?.filter((ch) => !!ch.chapterProgress && ch?.chapterProgress?.watched)
    ?.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue?.duration ?? 0),
      0
    );

  ChartJS.register(ArcElement, TooltipC);

  // ChartJS.defaults.plugins.legend.display = false;

  const data = {
    labels: ["Watched", "Not watched"],
    datasets: [
      {
        data: [chaptersWatched, course.chapters?.length - chaptersWatched],
        backgroundColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    radius: sideDrawerCollapsed ? 25 : 40,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="sticky top-0 z-10 flex w-full justify-between gap-4 bg-gradient-to-r from-neutral-950/70 via-neutral-950/70 to-neutral-950/70 p-4 text-neutral-300 duration-150 sm:from-neutral-950 sm:via-neutral-950/70 sm:to-transparent sm:pb-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-neutral-300 sm:text-sm"
          onClick={() => {
            MixPannelClient.getInstance().backToDashboardClicked({
              courseId: course_id,
              userId: session.data?.user?.id ?? "",
              lessonId: chapter_id,
            });
          }}
        >
          <ArrowLeftIcon className="w-4" /> Back to dashboard
        </Link>
        <button
          onClick={() => {
            setShareModal(true);
            MixPannelClient.getInstance().courseShared({
              courseId: course?.id ?? "",
              userId: session.data?.user?.id ?? "",
            });
          }}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-neutral-300 sm:text-sm"
        >
          <ShareIcon className="w-3" /> Share Course
        </button>
      </div>
      <div className="sticky top-12 z-20 flex w-full items-center justify-between bg-pink-500 px-2 py-2 pl-3 text-sm font-bold sm:mt-2 sm:hidden">
        <h4>Book a free 1:1 doubt resolving session!</h4>
        <Menu as="div" className="relative inline-block text-left">
          <div className="flex flex-col items-end">
            <Menu.Button
              as="button"
              className="z-2 mt-1 rounded-lg bg-neutral-200 px-3 py-1 text-sm font-bold text-pink-500"
              onClick={() => {
                MixPannelClient.getInstance().bookASessionClicked({
                  courseId: course_id,
                  userId: session.data?.user?.id ?? "",
                  lessonId: chapter_id,
                });
              }}
            >
              Book now
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 top-[2rem] z-10 mt-4 flex w-40 origin-top-right flex-col divide-y divide-neutral-800 overflow-hidden rounded-xl bg-neutral-200/20 backdrop-blur-sm duration-300">
                <Menu.Item>
                  <button
                    data-cal-link="rosekamallove/15min"
                    className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                    onClick={() => {
                      MixPannelClient.getInstance().sessionChoosed_15({
                        courseId: course_id,
                        userId: session.data?.user?.id ?? "",
                        lessonId: chapter_id,
                      });
                    }}
                  >
                    15 mins call
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    data-cal-link="rosekamallove/30min"
                    className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                    onClick={() => {
                      MixPannelClient.getInstance().sessionChoosed_30({
                        courseId: course_id,
                        userId: session.data?.user?.id ?? "",
                        lessonId: chapter_id,
                      });
                    }}
                  >
                    30 mins call
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </div>
        </Menu>
      </div>
      <div className="flex w-full flex-col-reverse justify-end gap-4 p-4 pr-0 pt-3 sm:flex-row sm:justify-start">
        {children}
        <div className={`flex flex-col rounded-lg`}>
          {!sideDrawerCollapsed ? (
            <div className="sticky top-[3.3rem] hidden h-44 w-full rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur sm:block">
              <div className="relative flex h-full w-full flex-col items-start">
                <div className="flex flex-col items-start justify-start gap-2 p-4">
                  <h3 className="m-0 p-0 text-sm font-bold text-pink-500">
                    Have some doubts in this chapter?
                  </h3>
                  <h3 className="m-0 max-w-[16rem] p-0 font-bold text-neutral-200">
                    Book a free 1:1 Doubt resolving session with our experts!
                  </h3>
                  <Menu as="div" className="relative inline-block text-left">
                    <div className="flex flex-col items-end">
                      <Menu.Button
                        as="button"
                        className="z-2 mt-1 rounded-lg bg-pink-500 px-4 py-1 text-sm font-bold hover:bg-pink-600 hover:text-neutral-200"
                        onClick={() => {
                          MixPannelClient.getInstance().bookASessionClicked({
                            courseId: course_id,
                            userId: session.data?.user?.id ?? "",
                            lessonId: chapter_id,
                          });
                        }}
                      >
                        Book now
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 top-[2rem] mt-2 flex w-40 origin-top-right flex-col divide-y divide-neutral-800 overflow-hidden rounded-xl bg-neutral-900/80 backdrop-blur-sm duration-300">
                          <Menu.Item>
                            <button
                              data-cal-link="rosekamallove/15min"
                              className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                              onClick={() => {
                                MixPannelClient.getInstance().sessionChoosed_15(
                                  {
                                    courseId: course_id,
                                    userId: session.data?.user?.id ?? "",
                                    lessonId: chapter_id,
                                  }
                                );
                              }}
                            >
                              15 mins call
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              data-cal-link="rosekamallove/30min"
                              className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                              onClick={() => {
                                MixPannelClient.getInstance().sessionChoosed_30(
                                  {
                                    courseId: course_id,
                                    userId: session.data?.user?.id ?? "",
                                    lessonId: chapter_id,
                                  }
                                );
                              }}
                            >
                              30 mins call
                            </button>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </div>
                  </Menu>
                </div>

                <div className="absolute bottom-0 -z-10 h-5 w-full rounded-b-lg bg-neutral-800" />
                <Image
                  src="/book-ta.png"
                  alt="Book TA Session"
                  width={206}
                  height={124}
                  className="absolute bottom-0 right-0"
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div
            className={`right-4 flex rounded-lg backdrop-blur-sm md:bg-neutral-200/5 ${
              sideDrawerCollapsed
                ? "top-[3.3rem] flex-row-reverse border-neutral-700 sm:sticky sm:h-[calc(100vh-4.5rem)] sm:max-w-[5rem] sm:flex-col sm:border sm:bg-neutral-950/80"
                : "fixed top-[3.3rem] h-[calc(100vh-4.5rem)] w-4/5 max-w-sm flex-col border border-neutral-700 bg-neutral-950/80 sm:top-[16rem] sm:h-[calc(100vh-17rem)] sm:w-full md:sticky"
            }`}
          >
            <button
              className={`absolute -left-5 top-6 z-10 aspect-square rounded-full border border-neutral-600 bg-neutral-900 p-2 text-neutral-400 drop-shadow-xl duration-150 hover:bg-neutral-800 hover:text-neutral-300 ${
                sideDrawerCollapsed ? "hidden sm:flex" : ""
              }`}
              onClick={() => {
                if (!sideDrawerCollapsed)
                  MixPannelClient.getInstance().overViewCollapsed({
                    courseId: course_id,
                    userId: session.data?.user?.id ?? "",
                    lessonId: chapter_id,
                  });

                setSideDrawerCollapsed(!sideDrawerCollapsed);
              }}
            >
              {sideDrawerCollapsed ? (
                <ChevronLeftIcon className="w-5" />
              ) : (
                <ChevronRightIcon className="w-5" />
              )}
            </button>
            <div
              className={`flex w-full flex-col gap-2 border-b border-neutral-700 p-4 px-6 transition-all duration-300 ${
                sideDrawerCollapsed ? "hidden" : ""
              }`}
            >
              <div
                className={`flex items-start justify-between ${
                  sideDrawerCollapsed ? "flex-col gap-1 sm:flex-row" : "gap-2"
                }`}
              >
                {sideDrawerCollapsed ? (
                  <></>
                ) : (
                  <Link
                    href={`/course/${course?.id ?? ""}`}
                    className="line-clamp-1 overflow-hidden text-ellipsis text-lg font-medium duration-150 hover:text-neutral-100"
                  >
                    {course?.title}
                  </Link>
                )}
              </div>

              {sideDrawerCollapsed ? (
                <></>
              ) : (
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <Link
                    href={`${
                      course?.creator
                        ? `/${course?.creator?.creatorProfile ?? ""}`
                        : `https://www.youtube.com/${course?.ytChannelId ?? ""}`
                    }`}
                    target={!course?.creator ? "_blank" : undefined}
                    className="duration-150 hover:text-neutral-200"
                    onClick={() => {
                      MixPannelClient.getInstance().creatorProfileClickedFromCourse(
                        {
                          courseId: course_id,
                          userId: session.data?.user?.id ?? "",
                          creatorId: course?.creatorId ?? "unclaimed",
                        }
                      );
                    }}
                  >
                    {course?.creator?.name ?? course?.ytChannelName ?? ""}
                  </Link>{" "}
                  • <p>{course?.chapters?.length} Chapters</p>
                </div>
              )}
            </div>
            {
              <button
                className={`${
                  sideDrawerCollapsed ? "px-2 sm:hidden" : "hidden"
                }`}
                onClick={() => setSideDrawerCollapsed(!sideDrawerCollapsed)}
              >
                <ListBulletIcon className="w-6" />
              </button>
            }
            <div
              className={`flex items-center overflow-hidden border-neutral-700 p-1 sm:p-2 [&.chartjs-legend]:hidden ${
                sideDrawerCollapsed
                  ? "gap-2 sm:w-full sm:gap-4 sm:border-b sm:border-l-0"
                  : "w-full gap-2 border-b sm:gap-4"
              }`}
            >
              <div
                className={`relative flex items-center justify-center ${
                  sideDrawerCollapsed
                    ? "hidden h-16 w-16 sm:flex"
                    : "h-24 w-24 sm:h-24 sm:w-24"
                }`}
              >
                <Pie data={data} options={options} />
              </div>
              <h5
                className={`${
                  sideDrawerCollapsed ? "block px-2 pr-3 sm:hidden" : "hidden"
                }`}
              >
                <span className="m-0 p-0 text-xl font-bold text-green-600">
                  {Math.ceil((chaptersWatched / course.chapters?.length) * 100)}
                  <span className="m-0 p-0 text-sm font-normal leading-3">
                    %
                  </span>
                </span>
              </h5>

              {sideDrawerCollapsed ? (
                <></>
              ) : (
                <div className="grid grid-cols-2 gap-x-1 gap-y-5 sm:gap-5">
                  <div className="m-0 flex items-end p-0 text-xs leading-3 text-neutral-300">
                    <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-green-600">
                      {Math.ceil(
                        (chaptersWatched / course.chapters?.length) * 100
                      )}
                      <span className="m-0 p-0 text-sm font-normal leading-3">
                        %
                      </span>
                    </span>{" "}
                    completed
                  </div>
                  <div className="m-0 flex items-center p-0 text-xs leading-3 text-neutral-300">
                    <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-neutral-200">
                      {minutesWatched}
                      <span className="m-0 p-0 text-sm font-normal leading-3">
                        mins
                      </span>
                    </span>{" "}
                    watched
                  </div>
                  <div className="m-0 flex items-end p-0 text-xs leading-3 text-neutral-300">
                    <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-green-600">
                      {chaptersWatched}
                      <span className="m-0 p-0 text-sm font-normal leading-3">
                        chs
                      </span>
                    </span>{" "}
                    watched
                  </div>
                  <div className="m-0 flex items-end p-0 text-xs leading-3 text-neutral-300">
                    <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-neutral-400">
                      {course.chapters?.length - chaptersWatched}
                      <span className="m-0 p-0 text-sm font-normal leading-3">
                        chs
                      </span>
                    </span>{" "}
                    remaining
                  </div>
                </div>
              )}
            </div>
            <div
              ref={chaptersNavRef}
              className={`flex w-full justify-start overflow-auto  ${
                sideDrawerCollapsed
                  ? "hide-scroll flex-row items-center justify-start sm:max-h-[calc(100vh-9rem)] sm:flex-col"
                  : "max-h-[calc(100vh-9rem)] flex-col sm:max-h-[calc(100vh-29rem)]"
              }`}
            >
              {course?.chapters?.map((chapter, idx) => (
                <CoursePlayerChapterTile
                  collapsed={sideDrawerCollapsed}
                  idx={idx}
                  chapter={chapter}
                  key={chapter?.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* stops content from sliding up on side bar open */}
        <div className={`${!sideDrawerCollapsed ? "h-[3rem] sm:h-0" : ""}`} />
      </div>
      <ShareCourseModal
        isOpen={shareModal}
        setIsOpen={setShareModal}
        courseId={course?.id ?? ""}
        courseTitle={course?.title ?? ""}
      />
    </div>
  );
};

type CPCTProps = {
  chapter: Chapter & { chapterProgress: ChapterProgress | undefined };
  idx: number;
  collapsed: boolean;
};

const CoursePlayerChapterTile = ({ chapter, idx, collapsed }: CPCTProps) => {
  const router = useRouter();
  const { chapter_id } = router.query as {
    chapter_id: string;
  };

  const { mutateAsync: markWatchedMutation } =
    api.courseChapter.markWatched.useMutation();

  const { mutateAsync: clearWatchedMutation } =
    api.courseChapter.clearWatched.useMutation();

  const [watchChecked, setWatchChecked] = useState(false);

  useEffect(() => {
    setWatchChecked(
      !!chapter?.chapterProgress && chapter?.chapterProgress?.watched
    );
  }, [chapter.chapterProgress]);

  const ctx = api.useContext();

  const { darkAlgorithm } = theme;

  return (
    <Link
      href={`/course/play/${chapter?.courseId}/${chapter?.id}`}
      id={`${chapter?.id}`}
      className={`group flex items-center border-neutral-700 text-xs last:rounded-b ${
        !(chapter.id === chapter_id)
          ? !!chapter.chapterProgress && chapter?.chapterProgress?.watched
            ? "!bg-green-950/30 hover:!bg-green-800/30"
            : "hover:bg-neutral-200/10"
          : " !bg-pink-900/10 hover:!bg-pink-900/20"
      }  bg-transparent backdrop-blur-sm duration-150 ${
        collapsed
          ? "mx-1 h-12 gap-2 rounded-lg border p-1 px-2 pr-4 sm:m-0 sm:aspect-square sm:h-auto sm:min-h-[4rem] sm:w-full sm:max-w-lg sm:rounded-none sm:border-0 sm:border-b sm:border-r-0 sm:p-2 sm:px-4"
          : "min-h-[4.5rem] w-full max-w-lg gap-3 border-b p-2 px-4"
      }`}
      key={chapter?.id}
    >
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
            e.preventDefault();
            setWatchChecked(!watchChecked);

            if (!!chapter?.chapterProgress && chapter?.chapterProgress?.watched)
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
                    void ctx.course.get.invalidate();
                    void ctx.courseChapter.get.invalidate();
                  },
                }
              );
          }}
        />
      </ConfigProvider>

      <p className={`group text-xs text-neutral-300`}>
        {chapter_id === chapter?.id ? (
          <PlayIcon
            className={`text-pink-500 ${collapsed ? "w-5" : "w-5 pr-2"}`}
          />
        ) : (
          <>
            <div
              className={`aspect-square ${
                collapsed
                  ? "w-5 text-base font-medium group-hover:hidden"
                  : "w-5 text-sm group-hover:hidden"
              }`}
            >
              {collapsed ? (
                <span className="text-xs uppercase text-neutral-400">#</span>
              ) : (
                <></>
              )}
              {idx + 1}
            </div>
            <PlayIcon
              className={`hidden text-neutral-400 group-hover:block ${
                collapsed ? "w-5" : "w-5 pr-2"
              }`}
            />
          </>
        )}
      </p>
      {collapsed ? (
        <></>
      ) : (
        <>
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
          <div
            className={`flex h-full w-full flex-col items-start justify-between gap-1`}
          >
            <h5
              className={`line-clamp-2 overflow-hidden text-ellipsis text-xs font-semibold`}
            >
              {chapter?.title}
            </h5>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-neutral-300">
                <ClockIcon className="w-3" />
                {chapter?.duration} min
              </label>
              {chapter.id === chapter_id ? (
                <span className="flex items-center text-xs text-pink-500/70">
                  <PlayIcon className="w-3" /> Watching
                </span>
              ) : watchChecked ? (
                <span className="flex items-center text-xs text-green-500/60">
                  <CheckIcon className="w-3" /> Watched
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

export function PlayerLayout(page: ReactNode) {
  return <PlayerLayoutR>{page}</PlayerLayoutR>;
}

Index.getLayout = PlayerLayout;

export default Index;
