import { type Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  course: Course & {
    _count: { chapters: number };
  };
  manage?: boolean;
  lg?: boolean;
};

const CourseCard = ({ course, manage, lg }: Props) => {
  return (
    <Link
      href={
        manage
          ? `/creator/dashboard/course/${course?.id}`
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
        <Image
          src={course?.thumbnail ?? ""}
          alt={course?.title ?? ""}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start gap-1">
        <h5 className={`font-medium ${lg ? "text-lg" : ""}`}>
          {course?.title}
        </h5>
        <p
          className={`flex items-center text-xs text-neutral-300 ${
            lg ? "!text-sm" : ""
          }`}
        >
          {course._count.chapters} Chapters
        </p>
        {!manage ? (
          <p
            className={`text-sm font-semibold uppercase tracking-widest text-green-500/80 ${
              lg ? "text-sm" : ""
            }`}
          >
            free
          </p>
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
