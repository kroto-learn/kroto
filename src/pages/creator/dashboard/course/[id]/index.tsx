import { Fragment } from "react";
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
import { LinkIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { TRPCError } from "@trpc/server";

const CourseLayoutR = dynamic(
  () => import("@/components/layouts/courseDashboard"),
  {
    ssr: false,
  }
);

// const SendUpdateModal = dynamic(() => import("@/components/SendUpdateModal"), {
//   ssr: false,
// });

const CourseOverview = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id,
  });

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

        <div className="mt-12s mx-auto flex w-full flex-col gap-8">
          <div className="flex w-full items-start gap-4 rounded-xl bg-neutral-800 p-4">
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

          <div className="flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                Blocks
              </label>
              {/* <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-pink-600 px-3 py-1 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
              >
                <PlusIcon className="w-4" /> Add Course block
              </button> */}
            </div>
            <div className="max-h-[20rem] overflow-y-auto">
              {course.courseBlocks.map((courseBlock, index) => (
                <div
                  className="flex items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                  key={courseBlock.title + index.toString()}
                >
                  <p className="text-sm text-neutral-300">{index + 1}</p>
                  <div className="relative mb-2 aspect-video w-40 overflow-hidden rounded-lg">
                    <Image
                      src={courseBlock?.thumbnail ?? ""}
                      alt={courseBlock?.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex h-full w-full flex-col items-start gap-1">
                    <h5 className="font-medium">{courseBlock.title}</h5>
                    <label className="flex items-center gap-1 rounded-lg bg-neutral-300/20 px-2 py-1 text-xs text-neutral-300">
                      <PlayCircleIcon className="w-3" />
                      Video
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
