import {
  CheckCircleIcon,
  ChevronDownIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { Doughnut } from "react-chartjs-2";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { Disclosure } from "@headlessui/react";

type Props = {
  courseId: string;
  defaultOpen?: boolean;
};

const ContinueLearningCard = ({ courseId, defaultOpen }: Props) => {
  const { data: courseFull, isLoading: courseFullLoading } =
    api.course.get.useQuery({
      id: courseId,
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
    cutout: 25,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const lastChIdx = courseFull?.chapters?.findIndex(
    (ch) => ch.id === courseFull?.courseProgress?.lastChapterId
  );
  const nextUnwatchedChIdx = courseFull?.chapters?.findIndex(
    (ch, idx) =>
      !(
        !!ch?.chapterProgress &&
        ch?.chapterProgress?.watched &&
        idx < lastChIdx
      )
  );

  console.log(
    "slicedarr",
    courseFull?.chapters?.slice(lastChIdx !== -1 ? lastChIdx : 0)
  );

  return (
    <Disclosure defaultOpen={!!defaultOpen}>
      {({ open }) => (
        <div className="relative flex w-full flex-col rounded-xl border border-neutral-800 bg-neutral-200/5 p-4 backdrop-blur-sm duration-150">
          <Disclosure.Button className="flex w-full items-center justify-between gap-3">
            <div className="flex w-full items-start gap-4">
              <div
                className={`relative hidden aspect-video w-48 overflow-hidden rounded-lg sm:block`}
              >
                <ImageWF
                  src={courseFull?.thumbnail ?? ""}
                  alt={courseFull?.title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="group flex h-full w-full flex-col items-start gap-2">
                <h5
                  className={`line-clamp-1 w-full overflow-hidden text-ellipsis text-left text-xs font-medium sm:text-sm`}
                >
                  {courseFull?.title}
                </h5>
                <p className={`flex items-center text-xs text-neutral-300`}>
                  {chaptersWatched} / {courseFull?.chapters?.length} Chapters
                </p>
                <Link
                  href={`/course/play/${courseFull.id}`}
                  className="flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold hover:bg-pink-600"
                >
                  <PlayIcon className="w-3" /> Resume Learning
                </Link>
              </div>
            </div>

            <div
              className={`relative flex h-16 w-16 items-center justify-center`}
            >
              <Doughnut data={data} options={options} />
              <div className="absolute flex h-full w-full items-center justify-center">
                <p className="text-xs font-bold text-green-500">
                  {Math.ceil(
                    (chaptersWatched / courseFull?.chapters?.length) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </Disclosure.Button>
          <Disclosure.Button>
            <ChevronDownIcon
              className={`absolute right-2 top-2 text-neutral-500 duration-150 ${
                open ? "rotate-180" : "rotate-0"
              } w-5`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="mb-2 ml-2 mt-8 flex w-full flex-col sm:ml-4">
            {nextUnwatchedChIdx - 3 >= 0 &&
            nextUnwatchedChIdx - 3 < courseFull?.chapters?.length ? (
              <>
                <div className="flex w-full items-center gap-2">
                  {courseFull?.chapters[nextUnwatchedChIdx - 3]?.chapterProgress
                    ?.watched ? (
                    <CheckCircleIcon className="m-0 w-6 min-w-[1.5rem] p-0 text-pink-600" />
                  ) : (
                    <div className="z-10 ml-[2px] h-5 w-5 min-w-[1.25rem] rounded-full bg-neutral-700" />
                  )}
                  <h4 className="m-0 line-clamp-1 w-full overflow-hidden text-ellipsis p-0 text-xs font-medium">
                    {/* <span className="w-6 rounded border border-pink-500/30 bg-pink-500/10 p-1 text-center text-xs font-bold  text-pink-500">
                  Ch.{" "}
                  {(courseFull?.chapters[nextUnwatchedChIdx - 2]?.position ??
                    0) + 1}
                </span> */}
                    {courseFull?.chapters[nextUnwatchedChIdx - 2]?.title}
                  </h4>
                </div>
                {nextUnwatchedChIdx - 2 >= 0 &&
                nextUnwatchedChIdx - 2 < courseFull?.chapters?.length ? (
                  <div
                    className={`ml-3 h-4 w-px scale-[1.2] ${
                      courseFull?.chapters[nextUnwatchedChIdx - 2]
                        ?.chapterProgress?.watched
                        ? "bg-pink-600"
                        : "bg-neutral-700"
                    }`}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {nextUnwatchedChIdx - 2 >= 0 &&
            nextUnwatchedChIdx - 2 < courseFull?.chapters?.length ? (
              <>
                <div className="flex w-full items-center gap-2">
                  {courseFull?.chapters[nextUnwatchedChIdx - 2]?.chapterProgress
                    ?.watched ? (
                    <CheckCircleIcon className="m-0 w-6 min-w-[1.5rem] p-0 text-pink-600" />
                  ) : (
                    <div className="z-10 ml-[2px] h-5 w-5 min-w-[1.25rem] rounded-full bg-neutral-700" />
                  )}
                  <h4 className="m-0 line-clamp-1 w-full overflow-hidden text-ellipsis  p-0 text-xs font-medium">
                    {courseFull?.chapters[nextUnwatchedChIdx - 2]?.title}
                  </h4>
                </div>
                {nextUnwatchedChIdx - 1 >= 0 &&
                nextUnwatchedChIdx - 1 < courseFull?.chapters?.length ? (
                  <div
                    className={`ml-3 h-4 w-px scale-[1.2] ${
                      courseFull?.chapters[nextUnwatchedChIdx - 1]
                        ?.chapterProgress?.watched
                        ? "bg-pink-600"
                        : "bg-neutral-700"
                    }`}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {nextUnwatchedChIdx - 1 >= 0 &&
            nextUnwatchedChIdx - 1 < courseFull?.chapters?.length ? (
              <>
                <div className="flex w-full items-center gap-2">
                  {courseFull?.chapters[nextUnwatchedChIdx - 1]?.chapterProgress
                    ?.watched ? (
                    <CheckCircleIcon className="m-0 w-6 min-w-[1.5rem] p-0 text-pink-600" />
                  ) : (
                    <div className="z-10 ml-[2px] h-5 w-5 min-w-[1.25rem] rounded-full bg-neutral-700" />
                  )}
                  <h4 className="m-0 line-clamp-1 w-full overflow-hidden text-ellipsis  p-0 text-xs font-medium">
                    {courseFull?.chapters[nextUnwatchedChIdx - 1]?.title}
                  </h4>
                </div>
                {nextUnwatchedChIdx >= 0 &&
                nextUnwatchedChIdx < courseFull?.chapters?.length ? (
                  <div
                    className={`ml-3 h-4 w-px scale-[1.2] ${
                      courseFull?.chapters[nextUnwatchedChIdx]?.chapterProgress
                        ?.watched
                        ? "bg-pink-600"
                        : "bg-neutral-700"
                    }`}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {nextUnwatchedChIdx >= 0 &&
            nextUnwatchedChIdx < courseFull?.chapters?.length ? (
              <>
                <div className="flex w-full items-center gap-2">
                  {courseFull?.chapters[nextUnwatchedChIdx]?.chapterProgress
                    ?.watched ? (
                    <CheckCircleIcon className="m-0 w-6 min-w-[1.5rem] p-0 text-pink-600" />
                  ) : (
                    <div className="z-10 ml-[2px] h-5 w-5 min-w-[1.25rem] rounded-full bg-neutral-700" />
                  )}
                  <h4 className="m-0 line-clamp-1 w-full overflow-hidden text-ellipsis  p-0 text-xs font-medium">
                    {courseFull?.chapters[nextUnwatchedChIdx]?.title}
                  </h4>
                </div>
                {nextUnwatchedChIdx + 1 >= 0 &&
                nextUnwatchedChIdx + 1 < courseFull?.chapters?.length ? (
                  <div
                    className={`ml-3 h-4 w-px scale-[1.2] ${
                      courseFull?.chapters[nextUnwatchedChIdx + 1]
                        ?.chapterProgress?.watched
                        ? "bg-pink-600"
                        : "bg-neutral-700"
                    }`}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {nextUnwatchedChIdx + 1 >= 0 &&
            nextUnwatchedChIdx + 1 < courseFull?.chapters?.length ? (
              <>
                <div className="flex w-full items-center gap-2">
                  {courseFull?.chapters[nextUnwatchedChIdx + 1]?.chapterProgress
                    ?.watched ? (
                    <CheckCircleIcon className="m-0 w-6 min-w-[1.5rem] p-0 text-pink-600" />
                  ) : (
                    <div className="z-10 ml-[2px] h-5 w-5 min-w-[1.25rem] rounded-full bg-neutral-700" />
                  )}
                  <h4 className="m-0 line-clamp-1 w-full overflow-hidden text-ellipsis  p-0 text-xs font-medium">
                    {courseFull?.chapters[nextUnwatchedChIdx + 1]?.title}
                  </h4>
                </div>
              </>
            ) : (
              <></>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default ContinueLearningCard;
