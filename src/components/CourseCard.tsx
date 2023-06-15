import { type Course } from "@prisma/client";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";

type Props = {
  course: Course & {
    _count: { chapters: number };
  };
  manage?: boolean;
  admin?: boolean;
  lg?: boolean;
};

const CourseCard = ({ course, manage, lg, admin }: Props) => {
  return (
    <Link
      href={
        manage
          ? `/creator/dashboard/course/${course?.id}`
          : admin
          ? `/admin/dashboard/course/${course?.id}`
          : `/course/${course?.id}`
      }
      className="flex w-full max-w-lg gap-3 rounded-xl p-2 backdrop-blur-sm duration-150 hover:bg-neutral-200/10"
      key={course?.id}
    >
      <div
        className={`relative aspect-video w-40 overflow-hidden rounded-lg ${
          lg ? "w-60" : ""
        }`}
      >
        <ImageWF
          src={course?.thumbnail ?? ""}
          alt={course?.title ?? ""}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start gap-1">
        <h5
          className={`line-clamp-2 overflow-hidden text-ellipsis text-xs font-medium sm:max-h-12 sm:text-base ${
            lg ? "text-lg" : ""
          }`}
        >
          {course?.title}
        </h5>
        <p
          className={`flex items-center text-xs text-neutral-300 ${
            lg ? "!sm:text-sm text-xs" : ""
          }`}
        >
          {course._count.chapters} Chapters
        </p>
        {!manage ? (
          course?.price === 0 ? (
            <p
              className={`text-xs font-semibold uppercase tracking-widest text-green-500/80 sm:text-sm`}
            >
              free
            </p>
          ) : (
            <p
              className={`text-xs font-semibold uppercase tracking-widest sm:text-sm`}
            >
              ₹ {course?.price}
            </p>
          )
        ) : (
          <></>
        )}

        {manage && !course?.creatorId ? (
          <p className="rounded bg-yellow-500/30 px-2 py-1 text-xs">
            unclaimed
          </p>
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
