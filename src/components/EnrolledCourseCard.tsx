import { PlayIcon } from "@heroicons/react/20/solid";
import { type CourseProgress, type Course, type Chapter } from "@prisma/client";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { Doughnut } from "react-chartjs-2";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";

type Props = {
  enrollment: {
    course: Course & {
      courseProgress:
        | (CourseProgress & {
            lastChapter: Chapter;
          })
        | undefined;
      _count: {
        chapters: number;
      };
    };
    id: string;
    courseId: string;
    userId: string;
  };
};

const EnrolledCourseCard = ({ enrollment }: Props) => {
  const { data: courseFull, isLoading: courseFullLoading } =
    api.course.get.useQuery({
      id: enrollment.courseId,
    });

  if (courseFullLoading)
    return (
      <div className="h-28 w-full animate-pulse rounded-xl bg-neutral-200/5 p-2 backdrop-blur-sm duration-150" />
    );

  if (!courseFull || courseFull instanceof TRPCError) return <></>;

  const chaptersWatched = courseFull.chapters?.filter(
    (ch) => !!ch?.chapterProgress && ch?.chapterProgress?.watched
  )?.length;

  const data = {
    labels: ["Watched", "Not watched"],
    datasets: [
      {
        data: [chaptersWatched, courseFull.chapters?.length - chaptersWatched],
        backgroundColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderColor: ["#16a34a", "rgba(255,255,255,0.1)"],
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    radius: 25,
    responsive: true,
    cutout: 40,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <Link
      href={`/course/play/${enrollment?.course.id}`}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-200/5 p-2 backdrop-blur-sm duration-150 hover:border-neutral-700 hover:bg-neutral-200/10"
      key={enrollment?.id}
    >
      <div className="flex w-full items-start gap-3">
        <div
          className={`relative aspect-video w-40 overflow-hidden rounded-lg`}
        >
          <ImageWF
            src={enrollment?.course?.thumbnail ?? ""}
            alt={enrollment?.course?.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
        <div className="group flex h-full w-full flex-col items-start gap-1">
          <h5
            className={`line-clamp-1 w-full overflow-hidden text-ellipsis text-xs font-medium sm:text-base`}
          >
            {enrollment?.course?.title}
          </h5>
          <p className={`flex items-center text-xs text-neutral-300`}>
            {enrollment.course._count.chapters} Chapters
          </p>

          <p
            className={`flex items-center gap-1 text-xs text-pink-500/70 group-hover:text-pink-500`}
          >
            <PlayIcon className="w-3" /> Resume learning
          </p>
        </div>
      </div>

      <div
        className={`relative flex items-center justify-center ${"h-24 w-24 sm:h-24 sm:w-24"}`}
      >
        <Doughnut data={data} options={options} />
        <div className="absolute flex h-full w-full items-center justify-center">
          <p className="text-xs font-bold text-green-500">
            {Math.ceil((chaptersWatched / courseFull?.chapters?.length) * 100)}%
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EnrolledCourseCard;
