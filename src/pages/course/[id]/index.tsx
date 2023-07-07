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
import { useEffect, useState } from "react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import CheckoutModal from "@/components/CheckoutModal";
import { type Discount, type Course } from "@prisma/client";
import { MixPannelClient } from "@/analytics/mixpanel";
import ImageWF from "@/components/ImageWF";
import ClaimCourseModal from "@/components/ClaimCourseModal";

type Props = {
  courseId: string;
};

const Index = ({ courseId }: Props) => {
  const { data: course } = api.course.getCourse.useQuery({ id: courseId });
  const session = useSession();
  // const router = useRouter();
  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.enrollmentCourse.enroll.useMutation();
  const { data: isEnrolled, isLoading: isEnrolledLoading } =
    api.enrollmentCourse.isEnrolled.useQuery({ courseId });
  const { successToast, errorToast } = useToast();
  const ctx = api.useContext();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [claimModalOpen, setClaimModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (courseId && session.status !== "loading")
      MixPannelClient.getInstance().courseViewed({
        userId: session.data?.user.id ?? "",
        courseId,
      });
  }, [courseId, session]);

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
  }&chapters=${course?.chapters?.length ?? 0}&creatorName=${
    course?.creator?.name ?? course?.ytChannelName ?? ""
  }`;

  const isDiscount =
    course?.permanentDiscount !== null ||
    (course?.discount &&
      course?.discount?.deadline?.getTime() > new Date().getTime());

  const discount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime()
      ? course?.discount?.price
      : course?.permanentDiscount ?? 0;

  const price = isDiscount ? discount : course?.price;

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
        {!course?.creatorId ? (
          <AnimatedSection
            delay={0.2}
            className="mt-16 flex w-full justify-center px-4"
          >
            <p className="text-center">
              Are you the creator of this course?{" "}
              <button
                onClick={() => setClaimModalOpen(true)}
                className="font-bold text-pink-500 hover:text-pink-600"
              >
                Click here
              </button>{" "}
              to claim this course now!
            </p>
          </AnimatedSection>
        ) : (
          <></>
        )}
        <div className="hide-scroll mx-auto mb-8 flex w-full max-w-4xl flex-col gap-4 overflow-x-hidden p-4 sm:h-[80vh] sm:flex-row">
          <AnimatedSection className="flex h-full w-full flex-col items-start gap-2 rounded-xl bg-gradient-to-b from-neutral-700 via-neutral-800 to-transparent p-4 backdrop-blur-sm sm:w-[30rem]">
            <div className="relative aspect-video w-full content-center overflow-hidden rounded-xl">
              <ImageWF
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
                href={`${
                  course?.creator
                    ? `/${course?.creator?.creatorProfile ?? ""}`
                    : `https://www.youtube.com/${course?.ytChannelId ?? ""}`
                }`}
                target={!course?.creator ? "_blank" : undefined}
                className="group flex items-center gap-1"
              >
                <Image
                  src={course?.creator?.image ?? course?.ytChannelImage ?? ""}
                  alt={course?.creator?.name ?? course?.ytChannelName ?? ""}
                  className="aspect-square rounded-full"
                  width={22}
                  height={22}
                />
                <p className="text-sm text-neutral-300 duration-150 group-hover:text-neutral-200">
                  {course?.creator?.name ?? course?.ytChannelName ?? ""}
                </p>
              </Link>
            </div>

            {session.status !== "loading" && !isEnrolledLoading ? (
              course?.creator?.id &&
              session.data?.user.id === course?.creator?.id ? (
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
              ) : isEnrolled ? (
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
                <>
                  <div className="flex items-center gap-2">
                    {isDiscount ? (
                      discount === 0 ? (
                        <p
                          className={`text-xs font-bold uppercase tracking-widest text-green-500/80 sm:text-sm`}
                        >
                          free
                        </p>
                      ) : (
                        <p
                          className={`text-xs font-bold uppercase tracking-wide sm:text-sm`}
                        >
                          ₹{discount}
                        </p>
                      )
                    ) : (
                      <></>
                    )}
                    {course?.price === 0 ? (
                      <p
                        className={`text-xs font-bold uppercase tracking-widest text-green-500/80 sm:text-sm`}
                      >
                        free
                      </p>
                    ) : (
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide sm:text-sm ${
                          isDiscount
                            ? "font-thin line-through decoration-1"
                            : "font-bold"
                        }`}
                      >
                        ₹{course?.price}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (!session.data) {
                          void signIn(undefined, {
                            callbackUrl: `/course/${courseId}`,
                          });

                          return;
                        }
                        if (price === 0)
                          await enrollMutation(
                            { courseId: course?.id },
                            {
                              onSuccess: () => {
                                MixPannelClient.getInstance().courseEnrolled({
                                  courseId,
                                  userId: session?.data.user?.id ?? "",
                                });
                                void ctx.enrollmentCourse.isEnrolled.invalidate();
                                successToast(
                                  "Successfully enrolled in course!"
                                );
                              },
                              onError: () => {
                                errorToast("Error in enrolling in course!");
                              },
                            }
                          );
                        else setCheckoutModalOpen(true);
                      }}
                      className={`group my-1 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
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
                      className={`group my-1 inline-flex items-center justify-center gap-[0.15rem] rounded-xl border border-pink-500 px-6  py-1 text-center font-medium text-pink-500 transition-all duration-300 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600`}
                    >
                      <>
                        <PlayIcon className="w-4" />
                        <span>Preview</span>
                      </>
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="flex w-full flex-col gap-1">
                <div className="mt-2 h-4 w-20 animate-pulse rounded-lg bg-neutral-500" />
                <div className="mt-2 h-8 w-32 animate-pulse rounded-xl bg-neutral-500" />
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
                  <p className="text-xs text-neutral-400">
                    {course?.creator?.name ?? course?.ytChannelName ?? ""}
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
        setCheckoutModalOpen={setCheckoutModalOpen}
      />
      <CheckoutModal
        course={{
          ...(course as Course & { discount: Discount | null }),
          _count: { chapters: course?.chapters.length },
        }}
        isOpen={checkoutModalOpen}
        setIsOpen={setCheckoutModalOpen}
      />
      <ClaimCourseModal
        courseId={courseId}
        isOpen={claimModalOpen}
        setIsOpen={setClaimModalOpen}
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
