import { PlayIcon } from "@heroicons/react/20/solid";
import { type CourseProgress, type Course, type Chapter } from "@prisma/client";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";

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
  return (
    <Link
      href={`/course/play/${enrollment?.course.id}`}
      className="group flex w-full max-w-xl gap-3 rounded-xl p-2 backdrop-blur-sm duration-150 hover:bg-neutral-200/10"
      key={enrollment?.id}
    >
      <div className={`relative aspect-video w-40 overflow-hidden rounded-lg`}>
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
    </Link>
  );
};

export default EnrolledCourseCard;
