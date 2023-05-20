import AnimatedSection from "@/components/AnimatedSection";
import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import useToast from "@/hooks/useToast";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/20/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { TRPCError } from "@trpc/server";
import { type GetStaticPropsContext } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { useState } from "react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";

type Props = {
  courseId: string;
};

const Index = ({ courseId }: Props) => {
  const { data: course } = api.course.getCourse.useQuery({ id: courseId });
  const session = useSession();
  // const router = useRouter();
  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.course.enroll.useMutation();
  const { data: isEnrolled } = api.course.isEnrolled.useQuery({ courseId });
  const { successToast, errorToast } = useToast();
  const ctx = api.useContext();
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  if (course instanceof TRPCError || !course)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-neutral-200">
          Course not found
        </h1>
        <Link
          href="/"
          className="mt-4 flex items-center gap-2 text-xl font-medium text-pink-500 transition duration-300 hover:text-pink-600"
        >
          <ArrowLeftIcon className="w-6" />
          Go back to home
        </Link>
      </div>
    );

  const dynamicOgImage = `https://kroto.in/api/og/course?title=${
    course?.title ?? ""
  }&chapters=${course?.chapters.length ?? 0}&creatorName=${
    course?.creator?.name ?? ""
  }`;

  return (
    <>
      <Layout>
        <Head>
          <title>{course?.title}</title>
          <meta name="description" content={course?.description ?? ""} />
          {/* Google SEO */}
          <meta itemProp="name" content={course?.title ?? ""} />
          <meta itemProp="description" content={course?.description ?? ""} />
          <meta itemProp="image" content={course?.ogImage ?? dynamicOgImage} />
          {/* Facebook meta */}
          <meta property="og:title" content={course?.title ?? ""} />
          <meta property="og:description" content={course?.description ?? ""} />
          <meta
            property="og:image"
            content={course?.ogImage ?? dynamicOgImage}
          />
          <meta property="image" content={course?.ogImage ?? dynamicOgImage} />
          <meta
            property="og:url"
            content={`https://kroto.in/course/${course?.id ?? ""}`}
          />
          <meta property="og:type" content="website" />
          {/* twitter meta */}
          <meta name="twitter:title" content={course?.title ?? ""} />
          <meta
            name="twitter:description"
            content={course?.description ?? ""}
          />
          <meta
            name="twitter:image"
            content={course?.ogImage ?? dynamicOgImage}
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <div className="hide-scroll mx-auto mb-8 mt-16 flex w-full max-w-4xl flex-col gap-4 overflow-x-hidden p-4 sm:h-[80vh] sm:flex-row">
          <AnimatedSection className="flex h-full w-full flex-col items-start gap-2 rounded-xl bg-gradient-to-b from-neutral-700 via-neutral-800 to-transparent p-4 backdrop-blur-sm sm:w-[30rem]">
            <div className="relative aspect-video w-full content-center overflow-hidden rounded-xl">
              <Image
                src={course?.thumbnail ?? ""}
                alt={course?.title ?? ""}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{course?.title}</h2>

            <div className="flex w-full items-center gap-6">
              <p className="mb-1 text-sm text-neutral-300">
                {course?.chapters.length} Chapters
              </p>

              <Link
                href={`/${course?.creator?.creatorProfile ?? ""}`}
                className="group flex items-center gap-1"
              >
                <Image
                  src={course?.creator?.image ?? ""}
                  alt={course?.creator?.name ?? ""}
                  className="aspect-square rounded-full"
                  width={22}
                  height={22}
                />
                <p className="text-sm text-neutral-300 duration-150 group-hover:text-neutral-200 group-hover:underline">
                  {course?.creator?.name}
                </p>
              </Link>
            </div>

            {session.data?.user.id !== course?.creator?.id ? (
              isEnrolled ? (
                <Link
                  href={`/course/play/${course?.id}`}
                  className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                >
                  <>
                    <PlayIcon className="w-4" />
                    <span>Play</span>
                  </>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!session.data) {
                        void signIn(undefined, {
                          callbackUrl: `/course/${courseId}`,
                        });

                        return;
                      }
                      await enrollMutation(
                        { courseId: course?.id },
                        {
                          onSuccess: () => {
                            void ctx.course.isEnrolled.invalidate();
                            successToast("Successfully enrolled in course!");
                          },
                          onError: () => {
                            errorToast("Error in enrolling in course!");
                          },
                        }
                      );
                    }}
                    className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                  >
                    {enrollLoading ? (
                      <div>
                        <Loader white />
                      </div>
                    ) : (
                      <>
                        <span>Enroll now</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl border border-pink-500 px-6  py-1 text-center font-medium text-pink-500 transition-all duration-300 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600`}
                  >
                    <>
                      <PlayIcon className="w-4" />
                      <span>Preview</span>
                    </>
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/course/play/${course?.id}`}
                  className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                >
                  <>
                    <PlayIcon className="w-4" />
                    <span>Play</span>
                  </>
                </Link>
                <Link
                  href={`/creator/dashboard/course/${course?.id}`}
                  className={`group my-4 inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/10 px-6 py-1  text-center font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200`}
                >
                  <>
                    <AdjustmentsHorizontalIcon className="w-4" />
                    <span>Manage</span>
                  </>
                </Link>
              </div>
            )}

            <p className="hide-scroll max-h-24 overflow-y-scroll text-xs text-neutral-300 sm:max-h-52 sm:text-sm">
              {course?.description}
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.1}
            className="flex h-full w-full flex-col gap-2 overflow-y-auto pr-2 sm:h-[calc(100vh-10rem)]"
          >
            {course?.chapters?.map((chapter, index) => (
              <button
                onClick={() => {
                  if (isEnrolled)
                    void router.push(
                      `/course/play/${course?.id}/${chapter?.id}`
                    );
                  else setPreviewOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                key={chapter?.id}
              >
                <p className="text-sm text-neutral-300">{index + 1}</p>
                <div className="relative aspect-video w-40 content-center overflow-hidden rounded-lg">
                  <Image
                    src={course?.thumbnail ?? ""}
                    alt={course?.title ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex h-full w-full flex-col items-start gap-1">
                  <h5 className="line-clamp-2 overflow-hidden text-ellipsis text-left text-xs font-medium sm:max-h-12 sm:text-base">
                    {chapter?.title}
                  </h5>
                  <p className="text-xs text-neutral-400">
                    {course?.creator?.name}
                  </p>
                </div>
              </button>
            ))}
          </AnimatedSection>
        </div>
      </Layout>
      <CoursePreviewModal
        courseId={courseId}
        isOpen={previewOpen}
        setIsOpen={setPreviewOpen}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: courses.map((course) => ({
      params: { id: course.id },
    })),
    fallback: "blocking",
  };
};

interface CParams extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = generateSSGHelper();
  const courseId = (context.params as CParams).id;

  if (typeof courseId !== "string") throw new Error("no slug");

  await ssg.course.getCourse.prefetch({ id: courseId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      courseId,
    },
  };
}

export default Index;
