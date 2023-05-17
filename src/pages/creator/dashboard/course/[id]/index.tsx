import { Fragment, useState } from "react";
import React, { type ReactNode } from "react";
import Head from "next/head";
import { DashboardLayout } from "../..";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import Image from "next/image";
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
import { LinkIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { TRPCError } from "@trpc/server";
import ChapterManagePreviewModal from "@/components/ChapterManagePreviewModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import { ClockIcon } from "@heroicons/react/24/outline";

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
          <div className="mb-2 flex w-full items-start gap-4 rounded-xl bg-neutral-800 p-4">
            <div className="flex w-1/3 flex-col gap-4">
              <div className="relative flex aspect-video w-full  items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
                <Image
                  src={course?.thumbnail ?? ""}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-full items-center justify-evenly gap-2">
                <button
                  className="aspect-square rounded-full bg-neutral-700 p-2 grayscale duration-300 hover:bg-neutral-600 hover:grayscale-0"
                  onClick={() => {
                    void navigator.clipboard.writeText(courseUrl);
                    successToast("Event URL copied to clipboard!");
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
                  title={`Enroll the "${
                    course?.title ?? ""
                  }" event on Kroto.in`}
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
            </div>

            <div className="w-2/3">
              <label
                htmlFor="title"
                className="text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Title
              </label>
              <p className="w-full text-sm font-medium text-neutral-200 duration-300 sm:text-base">
                {course?.title}
              </p>

              <label
                htmlFor="description"
                className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Description
              </label>
              <p className="hide-scroll max-h-20 overflow-y-auto text-xs text-neutral-300 sm:text-sm">
                {course?.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              void syncImportMutation(
                { id: course.id },
                {
                  onSuccess: () => {
                    void ctx.course.get.invalidate();
                    void revalidate(`/course/${course.id}`);
                    successToast("Course synced from YouTube successfully!");
                  },
                }
              );
            }}
            className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
          >
            {syncImportLoading ? (
              <Loader />
            ) : (
              <FontAwesomeIcon icon={faRotate} />
            )}
            Sync from YouTube
          </button>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                Chapters
              </label>
            </div>
            <div className="h-[calc(100vh-30rem)] overflow-y-auto pr-4">
              {course.chapters.map((chapter, index) => (
                <button
                  onClick={() => {
                    setPreviewPos(index);
                    setPreviewOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                  key={chapter.title + index.toString()}
                >
                  <p className="text-sm text-neutral-300">{index + 1}</p>
                  <div className="relative aspect-video w-40 overflow-hidden rounded-lg">
                    <Image
                      src={chapter?.thumbnail ?? ""}
                      alt={chapter?.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex h-full w-full flex-col items-start gap-1">
                    <h5 className="text-left font-medium">{chapter.title}</h5>
                    {chapter.duration ? (
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
          </div>
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

export const CourseNestedLayout = nestLayout(DashboardLayout, CourseLayout);

CourseOverview.getLayout = CourseNestedLayout;

export default CourseOverview;

function CourseLayout(page: ReactNode) {
  return <CourseLayoutR>{page}</CourseLayoutR>;
}

export { CourseLayout };
