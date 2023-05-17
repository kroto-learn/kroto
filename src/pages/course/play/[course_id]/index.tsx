import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { CheckIcon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { type Chapter, type ChapterProgress } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Checkbox, ConfigProvider, Tooltip, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState } from "react";
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
  const { course_id } = router.query as {
    course_id: string;
    chapter_id: string;
  };
  const { data: course } = api.course?.get.useQuery({ id: course_id });

  if (course instanceof TRPCError || !course) return <></>;

  const chaptersWatched = course.chapters.filter(
    (ch) => !!ch.chapterProgress
  ).length;

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
        data: [chaptersWatched, course.chapters.length - chaptersWatched],
        backgroundColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    radius: 40,
  };

  return (
    <div className="flex min-h-screen w-full gap-3 p-4">
      {children}
      <div className="sticky top-4 flex h-[calc(100vh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur-sm">
        <div className="flex w-full flex-col gap-2 border-b border-neutral-700 p-4 px-6">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/course/${course?.id ?? ""}`}
              className="text-lg font-medium duration-150 hover:text-neutral-100"
            >
              {course?.title}
            </Link>
            <Tooltip title="Back to Dashboard">
              <Link
                href="/dashboard"
                className="aspect-square rounded-full bg-neutral-800 p-1 text-neutral-400 duration-150 hover:bg-neutral-700 hover:text-neutral-300"
              >
                <XMarkIcon className="w-5" />
              </Link>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Link
              href={`/${course?.creator?.creatorProfile ?? ""}`}
              className="duration-150 hover:text-neutral-200"
            >
              {course?.creator?.name}
            </Link>{" "}
            • <p>{course?.chapters?.length} Chapters</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-neutral-700 p-2 [&.chartjs-legend]:hidden">
          <div className="flex h-24 w-24 items-center justify-center">
            <Pie data={data} options={options} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="m-0 flex items-end p-0 text-xs leading-3 text-neutral-300">
                <span className="m-0 mr-1 p-0 text-xl font-bold leading-3 text-green-600">
                  {Math.ceil((chaptersWatched / course.chapters.length) * 100)}
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
            </div>
            <div className="flex items-center gap-4">
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
                  {course.chapters.length - chaptersWatched}
                  <span className="m-0 p-0 text-sm font-normal leading-3">
                    chs
                  </span>
                </span>{" "}
                remaining
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-h-[calc(100vh-8rem)] w-full flex-col overflow-auto">
          {course?.chapters?.map((chapter, idx) => (
            <CoursePlayerChapterTile
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
};

const CoursePlayerChapterTile = ({ chapter, idx }: CPCTProps) => {
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
      className={`flex w-full max-w-lg items-center gap-3 border-b border-neutral-700 ${
        !(chapter.id === chapter_id)
          ? chapter.chapterProgress
            ? "!bg-green-950/30 hover:!bg-green-800/30"
            : "hover:bg-neutral-200/10"
          : " !bg-pink-900/10 hover:!bg-pink-900/20"
      }  bg-transparent p-2 px-4 backdrop-blur-sm duration-150 `}
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
          <PlayIcon className="w-3 text-pink-500" />
        ) : (
          <div className="aspect-square w-3">{idx + 1}</div>
        )}
      </p>
      <div className={`relative aspect-video w-40 overflow-hidden rounded-lg `}>
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
        <h5 className={`text-xs font-medium`}>{chapter?.title}</h5>

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
    </Link>
  );
};

export function PlayerLayout(page: ReactNode) {
  return <PlayerLayoutR>{page}</PlayerLayoutR>;
}

Index.getLayout = PlayerLayout;

export default Index;
