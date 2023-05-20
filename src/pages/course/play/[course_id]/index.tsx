import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PlayIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { type Chapter, type ChapterProgress } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Checkbox, ConfigProvider, Tooltip, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip as TooltipC } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, TooltipC);

const Index = () => {
  const router = useRouter();
  const { course_id } = router.query as { course_id: string };
  const { data: course } = api.course.get.useQuery({ id: course_id });

  useEffect(() => {
    if (
      !(course instanceof TRPCError) &&
      course &&
      course?.chapters?.length > 0
    ) {
      const lastChId = course?.courseProgress
        ? course?.courseProgress.lastChapterId
        : course?.chapters[0]?.id;
      void router.replace(`/course/play/${course_id}/${lastChId ?? ""}`);
    }
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
  const { data: course } = api.course?.get.useQuery({ id: course_id });
  const [sideDrawerCollapsed, setSideDrawerCollapsed] = useState(false);
  const chaptersNavRef = useRef<HTMLDivElement | null>(null);
  const [navbarScrollInit, setNavbarScrollInit] = useState(false);

  useEffect(() => {
    //TODO: scroll to chapter link, this doesn't work
    if (chaptersNavRef.current && !!course && !navbarScrollInit) {
      setNavbarScrollInit(true);
      const buttonToScrollTo = chaptersNavRef.current.querySelector(
        `#${chapter_id}`
      );

      if (buttonToScrollTo)
        buttonToScrollTo.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
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

  if (course instanceof TRPCError || !course) return <></>;

  const chaptersWatched = course.chapters.filter(
    (ch) => !!ch.chapterProgress
  )?.length;

  const minutesWatched = course.chapters
    .filter((ch) => !!ch.chapterProgress)
    .reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue?.duration ?? 0),
      0
    );

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
  };

  return (
    <div className="flex min-h-screen w-full flex-col-reverse justify-end gap-3 p-4 sm:flex-row sm:justify-start">
      {children}
      <div
        className={`flex rounded-lg border border-neutral-700 bg-neutral-950/80 backdrop-blur-sm sm:bg-neutral-200/5 ${
          sideDrawerCollapsed
            ? "right-4 top-4 flex-row-reverse sm:sticky sm:h-[calc(100vh-2rem)] sm:max-w-[5rem] sm:flex-col"
            : "fixed right-4 top-4 h-[calc(100vh-2rem)] w-4/5 max-w-sm flex-col sm:sticky sm:w-full"
        }`}
      >
        <div
          className={`flex flex-col gap-2 border-neutral-700 ${
            sideDrawerCollapsed
              ? "border-l p-1 sm:w-full sm:border-b sm:border-l-0"
              : "w-full border-b p-4 px-6"
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
                className="line-clamp-2 overflow-hidden text-ellipsis text-lg font-medium duration-150 hover:text-neutral-100"
              >
                {course?.title}
              </Link>
            )}
            <button
              onClick={() => setSideDrawerCollapsed(!sideDrawerCollapsed)}
              className={`aspect-square rounded-full p-2 text-neutral-400 duration-150 hover:bg-neutral-700 hover:text-neutral-300 ${
                sideDrawerCollapsed ? "" : "bg-neutral-800"
              }`}
            >
              {sideDrawerCollapsed ? (
                <ArrowsPointingOutIcon className="w-4" />
              ) : (
                <ArrowsPointingInIcon className="w-4" />
              )}
            </button>
            <Tooltip title="Exit Course Player">
              <Link
                href="/dashboard"
                className={`aspect-square rounded-full p-2 text-neutral-400 duration-150 hover:bg-red-500/30 hover:text-neutral-300  ${
                  sideDrawerCollapsed ? "" : "bg-neutral-800"
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-4" />
              </Link>
            </Tooltip>
          </div>

          {sideDrawerCollapsed ? (
            <></>
          ) : (
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Link
                href={`/${course?.creator?.creatorProfile ?? ""}`}
                className="duration-150 hover:text-neutral-200"
              >
                {course?.creator?.name}
              </Link>{" "}
              • <p>{course?.chapters?.length} Chapters</p>
            </div>
          )}
        </div>
        <div
          className={`flex items-center gap-4 overflow-hidden border-neutral-700 p-1 sm:p-2 [&.chartjs-legend]:hidden ${
            sideDrawerCollapsed
              ? "border-l sm:w-full sm:border-b sm:border-l-0"
              : "w-full border-b"
          }`}
        >
          <div
            className={`flex items-center justify-center ${
              sideDrawerCollapsed
                ? "hidden h-16 w-16 sm:flex"
                : "h-24 w-24 sm:h-24 sm:w-24"
            }`}
          >
            <Pie data={data} options={options} />
          </div>
          <h5
            className={`${sideDrawerCollapsed ? "block sm:hidden " : "hidden"}`}
          >
            <span className="m-0 p-0 text-xl font-bold text-green-600">
              {Math.ceil((chaptersWatched / course.chapters?.length) * 100)}
              <span className="m-0 p-0 text-sm font-normal leading-3">%</span>
            </span>
          </h5>

          {sideDrawerCollapsed ? (
            <></>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              <div className="m-0 flex items-end p-0 text-xs leading-3 text-neutral-300">
                <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-green-600">
                  {Math.ceil((chaptersWatched / course.chapters?.length) * 100)}
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
              ? "hide-scroll flex-row items-center sm:max-h-[calc(100vh-8rem)] sm:flex-col"
              : "max-h-[calc(100vh-8rem)] flex-col"
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

  const { mutateAsync: updateChapterProgressMutation } =
    api.courseChapter.updateChapterProgress.useMutation();

  const { mutateAsync: deleteChapterProgressMutation } =
    api.courseChapter.deleteChapterProgress.useMutation();

  const [watchChecked, setWatchChecked] = useState(false);

  useEffect(() => {
    setWatchChecked(!!chapter.chapterProgress);
  }, [chapter.chapterProgress]);

  const ctx = api.useContext();

  const { darkAlgorithm } = theme;

  return (
    <Link
      href={`/course/play/${chapter?.courseId}/${chapter?.id}`}
      id={`${chapter?.id}`}
      className={`flex w-full max-w-lg items-center border-neutral-700 ${
        !(chapter.id === chapter_id)
          ? chapter.chapterProgress
            ? "!bg-green-950/30 hover:!bg-green-800/30"
            : "hover:bg-neutral-200/10"
          : " !bg-pink-900/10 hover:!bg-pink-900/20"
      }  bg-transparent p-2 px-4 backdrop-blur-sm duration-150 ${
        collapsed
          ? "aspect-square gap-2 border-r sm:border-b sm:border-r-0"
          : "gap-3 border-b"
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
                  },
                }
              );
          }}
        />
      </ConfigProvider>

      <p className={`text-xs text-neutral-300`}>
        {chapter_id === chapter?.id ? (
          <PlayIcon className={`text-pink-500 ${collapsed ? "w-4" : "w-3"}`} />
        ) : (
          <div
            className={`aspect-square ${
              collapsed ? "w-4 text-xl font-medium" : "w-3"
            }`}
          >
            {collapsed ? (
              <span className="text-xs uppercase text-neutral-400">#</span>
            ) : (
              <></>
            )}
            {idx + 1}
          </div>
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
              className={`line-clamp-2 overflow-hidden text-ellipsis text-xs font-medium`}
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
