import { Fragment, useState } from "react";
import React, { type ReactNode } from "react";
import Head from "next/head";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import ImageWF from "@/components/ImageWF";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { LinkIcon, PlayIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { TRPCError } from "@trpc/server";
import ChapterManagePreviewModal from "@/components/ChapterManagePreviewModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import { ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { AdminDashboardLayout } from "../..";

const CourseLayoutR = dynamic(
  () => import("@/components/layouts/courseDashboard"),
  {
    ssr: false,
  }
);

const CourseOverview = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPos, setPreviewPos] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id,
  });

  const { mutateAsync: syncImportMutation, isLoading: syncImportLoading } =
    api.course.syncImport.useMutation();

  const ctx = api.useContext();
  const revalidate = useRevalidateSSG();

  const { successToast } = useToast();

  if (courseLoading)
    return (
      <>
        <Head>
          <title>Course | Overview</title>
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  if (course instanceof TRPCError || !course) return <>Not found</>;

  const courseUrl = `https://kroto.in/course/${course?.id ?? ""}`;

  if (course)
    return (
      <>
        <Head>
          <title>{`${course?.title ?? "Course"} | Overview`}</title>
        </Head>
        <div className="mx-auto flex w-full flex-col items-start gap-2">
          <AnimatedSection
            delay={0.2}
            className="mb-2 flex w-full flex-col items-start gap-4 rounded-xl bg-neutral-800 p-4 sm:flex-row"
          >
            <div className="flex w-full flex-col gap-4 sm:w-1/3">
              <div className="relative flex aspect-video w-full  items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
                <ImageWF
                  src={course?.thumbnail ?? ""}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 sm:w-full sm:justify-evenly">
                <button
                  className="aspect-square rounded-full bg-neutral-700 p-2 grayscale duration-300 hover:bg-neutral-600 hover:grayscale-0"
                  onClick={() => {
                    void navigator.clipboard.writeText(courseUrl);
                    successToast("Course URL copied to clipboard!");
                  }}
                >
                  <LinkIcon className="w-3" />
                </button>
                <LinkedinShareButton url={courseUrl}>
                  <LinkedinIcon
                    size={28}
                    round
                    className="grayscale duration-300 hover:grayscale-0"
                  />
                </LinkedinShareButton>
                <FacebookShareButton
                  url={courseUrl}
                  quote={`Enroll the "${
                    course?.title ?? ""
                  }" course on Kroto.in`}
                  hashtag={"#kroto"}
                >
                  <FacebookIcon
                    size={28}
                    round
                    className="grayscale duration-300 hover:grayscale-0"
                  />
                </FacebookShareButton>
                <TwitterShareButton
                  url={courseUrl}
                  title={`Enroll the "${course?.title ?? ""}" course on Kroto`}
                >
                  <TwitterIcon
                    size={28}
                    round
                    className="grayscale duration-300 hover:grayscale-0"
                  />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={courseUrl}
                  title={`Enroll the "${
                    course?.title ?? ""
                  }" course on Kroto.in`}
                  separator=": "
                >
                  <WhatsappIcon
                    size={28}
                    round
                    className="grayscale duration-300 hover:grayscale-0"
                  />
                </WhatsappShareButton>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="price"
                  className="text-xs font-medium uppercase tracking-wider text-neutral-400"
                >
                  Price
                </label>
                {course?.price === 0 ? (
                  <p className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm text-green-600 duration-300 sm:text-base">
                    Free
                  </p>
                ) : (
                  <p className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm font-bold text-neutral-200 duration-300 sm:text-base">
                    ₹ {course?.price}
                  </p>
                )}
              </div>

              {course?.category ? (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="category"
                    className="text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Category
                  </label>
                  <p className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm font-medium text-neutral-200 duration-300 sm:text-base">
                    {course?.category?.title}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="w-full sm:w-2/3">
              <label
                htmlFor="title"
                className="text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Title
              </label>
              <p className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm font-medium text-neutral-200 duration-300 sm:text-base">
                {course?.title}
              </p>

              {course?.description && course?.description !== "" ? (
                <>
                  <label
                    htmlFor="description"
                    className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Description
                  </label>
                  <div className="flex flex-col items-start">
                    <p
                      className={`${
                        !showFullDesc
                          ? "line-clamp-5 overflow-hidden text-ellipsis"
                          : ""
                      } text-xs text-neutral-300 sm:text-sm`}
                    >
                      {course?.description}
                    </p>
                    <button
                      className="font-bold"
                      onClick={() => {
                        setShowFullDesc(!showFullDesc);
                      }}
                    >
                      {!showFullDesc ? "more" : "less"}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {course?.tags?.length > 0 ? (
                <>
                  <label
                    htmlFor="tags"
                    className="text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-1">
                    {course?.tags?.map((tag) => (
                      <span
                        className="rounded-lg bg-neutral-200/30 px-2 py-1 text-xs"
                        key={tag?.id}
                      >
                        {tag?.title}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection
            delay={0.2}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <button
              onClick={() => {
                void syncImportMutation(
                  { id: course?.id },
                  {
                    onSuccess: () => {
                      void ctx.course.get.invalidate();
                      void revalidate(`/course/${course?.id}`);
                      if (course?.creator)
                        void revalidate(
                          `/${course?.creator.creatorProfile ?? ""}`
                        );
                      successToast("Course synced from YouTube successfully!");
                    },
                  }
                );
              }}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800 sm:text-xs`}
            >
              {syncImportLoading ? (
                <Loader />
              ) : (
                <FontAwesomeIcon icon={faRotate} />
              )}
              Sync from YouTube
            </button>

            <Link
              href={`/course/play/${course?.id}`}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800 sm:text-xs`}
            >
              <PlayIcon className="w-3" />
              View in Course Player
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={0.3} className="mt-4 flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                {course?.chapters?.length} Chapters
              </label>
            </div>
            <div className="max-h-[calc(100vh-24rem)] overflow-y-auto pr-1 sm:h-[calc(100vh-32.2rem)] sm:max-h-none sm:pr-4">
              {course?.chapters?.map((chapter, index) => (
                <button
                  onClick={() => {
                    setPreviewPos(index);
                    setPreviewOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                  key={chapter?.title + index.toString()}
                >
                  <p className="text-sm text-neutral-300">{index + 1}</p>
                  <div className="relative aspect-video w-40 overflow-hidden rounded-lg">
                    <ImageWF
                      src={chapter?.thumbnail ?? ""}
                      alt={chapter?.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex h-full w-full flex-col items-start gap-1">
                    <h5 className="line-clamp-2 overflow-hidden text-ellipsis text-left text-xs font-medium sm:max-h-12 sm:text-base">
                      {chapter?.title}
                    </h5>
                    {chapter?.duration ? (
                      <label className="flex items-center gap-1 text-xs text-neutral-300">
                        <ClockIcon className="w-3" />
                        {chapter?.duration} min
                      </label>
                    ) : (
                      <></>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <ChapterManagePreviewModal
          courseId={id}
          isOpen={previewOpen}
          setIsOpen={setPreviewOpen}
          position={previewPos}
          setPosition={setPreviewPos}
        />
      </>
    );
  else return <></>;
};

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const CourseNestedLayout = nestLayout(
  AdminDashboardLayout,
  CourseLayout
);

CourseOverview.getLayout = CourseNestedLayout;

export default CourseOverview;

function CourseLayout(page: ReactNode) {
  return <CourseLayoutR>{page}</CourseLayoutR>;
}

export { CourseLayout };
