import AnimatedSection from "@/components/AnimatedSection";
import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import useToast from "@/hooks/useToast";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import {
  ArrowLeftIcon,
  Bars3CenterLeftIcon,
  CheckIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { TRPCError } from "@trpc/server";
import { type GetStaticPropsContext } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import CheckoutModal from "@/components/CheckoutModal";
import { type Discount, type Course } from "@prisma/client";
import { MixPannelClient } from "@/analytics/mixpanel";
import ImageWF from "@/components/ImageWF";
import ClaimCourseModal from "@/components/ClaimCourseModal";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { getDateTimeDiffString } from "@/helpers/time";

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

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // just trigger this so that the initial state
    // is updated as soon as the component is mounted
    // related: https://stackoverflow.com/a/63408216
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isPreSaleDiscount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime();

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
        {scrollY > 300 ? (
          <div className="fixed left-20 top-20 z-10">
            <BuyCourseBox
              courseId={courseId}
              setCheckoutModalOpen={setCheckoutModalOpen}
              setPreviewOpen={setPreviewOpen}
            />
          </div>
        ) : (
          <></>
        )}
        <div
          style={{
            backgroundImage: "url(" + (course?.thumbnail ?? "") + ")",
          }}
          className={`m-0 w-full p-0`}
        >
          <div className="flex w-full justify-center bg-neutral-900/80 p-4 backdrop-blur-lg">
            <div className="flex w-full max-w-7xl items-center gap-8">
              {scrollY <= 300 ? (
                <BuyCourseBox
                  courseId={courseId}
                  setCheckoutModalOpen={setCheckoutModalOpen}
                  setPreviewOpen={setPreviewOpen}
                />
              ) : (
                <div className="w-80 min-w-[20rem]" />
              )}

              <div className="flex h-full w-full flex-col items-start gap-4 p-4">
                <h1 className="text-4xl font-bold text-neutral-100">
                  {course?.title}
                </h1>
                <div className="flex w-full items-center gap-6">
                  {course?.chapters.length > 0 ? (
                    <p className="mb-1 text-sm text-neutral-300">
                      {course?.chapters.length} Chapters
                    </p>
                  ) : (
                    <></>
                  )}

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
                      src={
                        course?.creator?.image ?? course?.ytChannelImage ?? ""
                      }
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
                <div className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-neutral-200/20 p-4">
                  <h3 className="text-base font-bold sm:text-lg">
                    What you&apos;ll learn
                  </h3>
                  <div className="grid grid-cols-2 gap-3 gap-x-6">
                    {(course?.outcomes as string[])?.map((o, idx) => (
                      <div key={`o-${idx}`} className="flex items-center gap-2">
                        <CheckIcon className="w-4" />{" "}
                        <h4 className="text-neutral-100">{o}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="mt-8 flex w-full max-w-7xl gap-8">
            <div className="w-[21rem] min-w-[21rem]" />
            <AnimatedSection delay={0.1} className="flex w-full  flex-col">
              <div className="flex items-center gap-2 px-4 py-3 text-neutral-200">
                <Bars3CenterLeftIcon className="w-5" />
                <h2 className="text-xl font-bold">Description</h2>
              </div>
              <div className="prose prose-invert prose-pink w-full px-4 pb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {course?.description ?? ""}
                </ReactMarkdown>
              </div>
            </AnimatedSection>
          </div>
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

type BProps = {
  courseId: string;
  setCheckoutModalOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
};

const BuyCourseBox = ({
  courseId,
  setCheckoutModalOpen,
  setPreviewOpen,
}: BProps) => {
  const session = useSession();
  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.enrollmentCourse.enroll.useMutation();
  const { data: isEnrolled, isLoading: isEnrolledLoading } =
    api.enrollmentCourse.isEnrolled.useQuery({ courseId });
  const { successToast, errorToast } = useToast();
  const ctx = api.useContext();

  const { data: course } = api.course.getCourse.useQuery({ id: courseId });

  if (course instanceof TRPCError || !course) return <></>;

  const isDiscount =
    course?.permanentDiscount !== null ||
    (course?.discount &&
      course?.discount?.deadline?.getTime() > new Date().getTime());

  const isPreSaleDiscount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime();

  const discount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime()
      ? course?.discount?.price
      : course?.permanentDiscount ?? 0;

  const price = isDiscount ? discount : course?.price;

  return (
    <AnimatedSection className="rounded-lg bg-neutral-600/20 p-2">
      <div className="w-80 min-w-[20rem] flex-col gap-2 overflow-hidden rounded-lg bg-neutral-600/40">
        <div className="relative aspect-video w-full object-cover">
          <ImageWF
            src={course?.thumbnail ?? ""}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col p-4">
          {session.status !== "loading" && !isEnrolledLoading ? (
            course?.creator?.id &&
            session.data?.user.id === course?.creator?.id ? (
              <div className="mt-4 flex items-center gap-2">
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
                        className={`text-sm font-bold uppercase tracking-widest text-green-500/80 sm:text-base`}
                      >
                        free
                      </p>
                    ) : (
                      <p
                        className={`font-bold uppercase tracking-wide  ${
                          !isDiscount
                            ? "text-base sm:text-lg"
                            : "text-lg font-black sm:text-2xl"
                        }`}
                      >
                        ₹{discount}
                      </p>
                    )
                  ) : (
                    <></>
                  )}
                  {course?.price === 0 ? (
                    <p
                      className={`text-base font-bold uppercase tracking-widest text-green-500/80 sm:text-lg`}
                    >
                      free
                    </p>
                  ) : (
                    <p
                      className={` font-semibold uppercase tracking-wide  ${
                        isDiscount
                          ? "text-base font-thin line-through decoration-1 sm:text-lg"
                          : "text-lg font-bold sm:text-2xl"
                      }`}
                    >
                      ₹{course?.price}
                    </p>
                  )}
                </div>

                {isPreSaleDiscount ? (
                  <p className="text-sm text-pink-500">
                    <span className="font-bold">
                      {getDateTimeDiffString(
                        course?.discount?.deadline ?? new Date(),
                        new Date()
                      )}
                    </span>{" "}
                    remaining on this price!
                  </p>
                ) : (
                  <></>
                )}

                <div className="mt-4 flex items-center gap-2">
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
                              successToast("Successfully enrolled in course!");
                            },
                            onError: () => {
                              errorToast("Error in enrolling in course!");
                            },
                          }
                        );
                      else setCheckoutModalOpen(true);
                    }}
                    className={`group my-1 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1 text-center font-bold text-neutral-200 transition-all duration-300 hover:bg-pink-600 sm:text-lg`}
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
                    className={`group my-1 inline-flex items-center justify-center gap-[0.15rem] rounded-xl border border-pink-500 px-6  py-1 text-center font-bold text-pink-500 transition-all duration-300 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600`}
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
        </div>
      </div>
    </AnimatedSection>
  );
};

export const getStaticPaths = async () => {
  const paths: { params: { creator_id: string; id: string } }[] = [];

  const creators = await prisma.user.findMany({
    where: {
      isCreator: true,
    },
  });

  await Promise.all(
    creators.map(async (creator) => {
      const courses = await prisma.course.findMany({
        where: {
          creatorId: creator.id,
        },
        select: {
          id: true,
        },
      });

      paths.push(
        ...courses.map((course) => ({
          params: {
            creator_id: creator?.creatorProfile ?? "",
            id: course.id,
          },
        }))
      );
    })
  );

  return {
    paths,
    fallback: "blocking",
  };
};

interface CParams extends ParsedUrlQuery {
  id: string;
  creator_id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = generateSSGHelper();
  const courseId = (context.params as CParams).id;
  const creatorId = (context.params as CParams).creator_id;

  if (typeof courseId !== "string") throw new Error("no slug");

  await ssg.course.getCourse.prefetch({ id: courseId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      courseId,
      creatorId,
    },
  };
}

export default Index;
