import { Loader } from "@/components/Loader";
import YouTube from "react-youtube";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/20/solid";

const Index = () => {
  const router = useRouter();
  const { chapter_id, course_id } = router.query as {
    chapter_id: string;
    course_id: string;
  };
  const { data: chapter, isLoading: chapterLoading } =
    api.courseChapter.get.useQuery({ id: chapter_id });

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id: course_id,
  });

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

  if (chapterLoading || courseLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
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

  return (
    <div className="flex min-h-screen w-full gap-3 p-4">
      <div className="flex w-full flex-col items-start gap-2">
        {chapter.type !== "TEXT" ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-700">
            <YouTube
              className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
              videoId={chapter?.ytId ?? ""}
              opts={youtubeOpts}
              // onReady={this._onReady}
            />
          </div>
        ) : (
          <></>
        )}
        <h3 className="mx-4 mt-2 text-lg font-medium">{chapter?.title}</h3>
        <div className="mx-4 mt-2 flex items-center gap-2">
          <Image
            src={chapter?.creator?.image ?? ""}
            alt={chapter?.creator?.name}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="font-medium text-neutral-300">
            {chapter?.creator?.name}
          </p>
        </div>
        <div className="mt-4 flex w-full flex-col rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur-sm">
          <div className="flex w-full items-center gap-2 border-b border-neutral-700 p-2 px-6">
            <DocumentTextIcon className="w-4" />
            <h4 className="font-medium uppercase tracking-wider">
              Description
            </h4>
          </div>
          <p className="w-full whitespace-pre-wrap p-6">
            {chapter?.type === "YTVIDEO" && chapter?.description}
          </p>
        </div>
      </div>
      <div className=" top-4 flex h-[calc(100vh-2rem)] w-full max-w-sm flex-col rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur-sm">
        <div className="flex w-full flex-col gap-2 border-b border-neutral-700 p-4 px-6">
          <h3 className="text-lg font-medium">{course?.title}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <p>{course.creator.name}</p> •{" "}
            <p>{course.courseBlocks.length} Chapters</p>
          </div>
        </div>
        <div className="flex max-h-[calc(100vh-8rem)] w-full flex-col overflow-auto">
          {course.courseBlocks.map((chapter, idx) => (
            <Link
              href={`/course/play/${course?.id}/${chapter?.id}`}
              className="flex w-full max-w-lg items-center gap-3 border-b border-neutral-700 bg-transparent p-2 px-4 backdrop-blur-sm duration-150 hover:bg-neutral-200/10"
              key={chapter?.id}
            >
              <p className={`text-xs text-neutral-300`}>
                {chapter_id === chapter?.id ? (
                  <PlayIcon className="w-3 text-pink-500" />
                ) : (
                  <div className="aspect-square w-3">{idx + 1}</div>
                )}
              </p>
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
              <div className="flex h-full w-full flex-col items-start gap-1">
                <h5 className={`text-sm font-medium`}>{chapter?.title}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
