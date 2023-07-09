import { Loader } from "@/components/Loader";
import useToast from "@/hooks/useToast";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import {
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  LockClosedIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

import { type GetStaticPropsContext } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { prisma } from "@/server/db";
import CheckoutModal from "@/components/CheckoutModal";
import { type Discount, type Course, type User } from "@prisma/client";
import { MixPannelClient } from "@/analytics/mixpanel";
import ImageWF from "@/components/ImageWF";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { getDateTimeDiffString } from "@/helpers/time";
import CreatorLayout from "@/components/layouts/creator";
import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";

type Props = {
  courseId: string;
  creatorProfile: string;
};

const Index = ({ courseId, creatorProfile }: Props) => {
  const session = useSession();
  const ctx = api.useContext();

  const { successToast, errorToast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState(0);

  const { data: creator } = api.creator.getPublicProfile.useQuery({
    creatorProfile,
  });

  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.enrollmentCourse.enroll.useMutation();

  const { data: isEnrolled, isLoading: isEnrolledLoading } =
    api.enrollmentCourse.isEnrolled.useQuery({ courseId });

  const { data: course } = api.course.getCourse.useQuery({ id: courseId });

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

  if (!course)
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

  type Module = {
    title: string;
    chapters: {
      title: string;
      type: "video" | "article";
      duration: number;
      isPublic?: boolean;
    }[];
  };

  const modules: Module[] = [
    {
      title: "Get Started",
      chapters: [
        {
          title: "What we will learn in this course?",
          type: "video",
          duration: 12,
          isPublic: true,
        },
        {
          title: "Introduction to Nextjs",
          type: "video",
          duration: 12,
        },
        {
          title: "Why Nextjs?",
          type: "video",
          duration: 12,
        },
        {
          title: "Server Side Rendering",
          type: "article",
          duration: 5,
        },
      ],
    },
    {
      title: "Building Components",
      chapters: [
        {
          title: "Working with React Components",
          type: "video",
          duration: 18,
        },
        {
          title: "State and Props",
          type: "video",
          duration: 15,
        },
        {
          title: "Component Lifecycle",
          type: "video",
          duration: 20,
        },
        {
          title: "Handling Events",
          type: "video",
          duration: 14,
        },
        {
          title: "Reusable Component Patterns",
          type: "article",
          duration: 7,
        },
      ],
    },
    {
      title: "Routing and Data Fetching",
      chapters: [
        {
          title: "Client-Side Routing",
          type: "video",
          duration: 16,
        },
        {
          title: "Server-Side Rendering",
          type: "video",
          duration: 22,
        },
        {
          title: "Data Fetching Methods",
          type: "video",
          duration: 18,
        },
        {
          title: "Handling API Responses",
          type: "video",
          duration: 14,
        },
        {
          title: "Authentication and Protected Routes",
          type: "article",
          duration: 9,
        },
      ],
    },
    {
      title: "Styling in Nextjs",
      chapters: [
        {
          title: "CSS-in-JS with Styled Components",
          type: "video",
          duration: 16,
        },
        {
          title: "CSS Modules and Scoped Styles",
          type: "video",
          duration: 20,
        },
        {
          title: "Global Styles and Theming",
          type: "video",
          duration: 18,
        },
        {
          title: "Responsive Design Techniques",
          type: "article",
          duration: 8,
        },
        {
          title: "Optimizing CSS Performance",
          type: "article",
          duration: 6,
        },
      ],
    },
  ];

  const totalDuration = modules.reduce((totalDuration, module) => {
    const duration = module.chapters.reduce((moduleDuration, chapter) => {
      return moduleDuration + chapter.duration;
    }, 0);
    return totalDuration + duration;
  }, 0);

  return (
    <>
      <CreatorLayout creator={creator as User}>
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
          <div className="fixed top-20 z-10 flex w-full justify-center">
            <div className="flex w-full max-w-5xl justify-end">
              <BuyCourseBox
                creatorProfile={creatorProfile}
                courseId={courseId}
                setCheckoutModalOpen={setCheckoutModalOpen}
                setPreviewOpen={setPreviewOpen}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div
          style={{
            backgroundImage: "url(" + (course?.thumbnail ?? "") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
          className={`m-0 w-full p-0`}
        >
          <div className="flex w-full justify-center bg-neutral-900/90 backdrop-blur-xl sm:p-4">
            <div className="flex w-full max-w-5xl flex-col items-center gap-2 sm:flex-row sm:gap-8">
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 100 }}
                transition={{ delay: 0, type: "tween" }}
                className="relative aspect-video w-full min-w-full object-cover sm:hidden"
              >
                <ImageWF
                  src={course?.thumbnail ?? ""}
                  alt=""
                  fill
                  className="aspect-video object-cover"
                />
              </motion.div>

              <div className="flex h-full w-full flex-col items-start gap-4 p-4">
                <motion.h1
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  transition={{ delay: 0.05, type: "tween" }}
                  className="text-xl font-bold text-neutral-100 sm:text-3xl md:text-4xl"
                >
                  {course?.title}
                </motion.h1>
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  transition={{ delay: 0.1, type: "tween" }}
                  className="flex w-full items-center gap-6"
                >
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
                </motion.div>

                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  transition={{ delay: 0.15, type: "tween" }}
                  className="flex w-full flex-col sm:hidden"
                >
                  {session.status !== "loading" && !isEnrolledLoading ? (
                    course?.creator?.id &&
                    session.data?.user.id === course?.creator?.id ? (
                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          href={`/course/play/${course?.id}`}
                          className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                        >
                          <>
                            <PlayIcon className="w-4" />
                            <span>Play</span>
                          </>
                        </Link>
                        <Link
                          href={`/creator/dashboard/course/${course?.id}`}
                          className={`group my-4 inline-flex items-center justify-center gap-1 rounded-full bg-pink-500/10 px-6 py-1  text-center font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200`}
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
                        className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                      >
                        <>
                          <PlayIcon className="w-4" />
                          <span>Play</span>
                        </>
                      </Link>
                    ) : (
                      <>
                        <div className="flex items-end gap-2">
                          {isDiscount ? (
                            discount === 0 ? (
                              <p
                                className={` text-3xl font-bold uppercase tracking-widest text-green-500/80`}
                              >
                                free
                              </p>
                            ) : (
                              <p
                                className={`font-bold uppercase tracking-wide  ${
                                  !isDiscount
                                    ? " text-lg"
                                    : " text-3xl font-black"
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
                              className={`text-3xl font-bold uppercase tracking-widest text-green-500/80`}
                            >
                              free
                            </p>
                          ) : (
                            <p
                              className={` font-semibold uppercase tracking-wide  ${
                                isDiscount
                                  ? "text-lg font-thin line-through decoration-1"
                                  : "text-3xl font-bold"
                              }`}
                            >
                              ₹{course?.price}
                            </p>
                          )}
                        </div>

                        {isPreSaleDiscount ? (
                          <p className="mt-1 text-sm text-pink-500">
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

                        <div className="mt-4 flex flex-col items-center gap-2">
                          <button
                            onClick={async () => {
                              if (!session.data) {
                                void signIn(undefined, {
                                  callbackUrl: `/${creatorProfile}/course/${courseId}`,
                                });

                                return;
                              }
                              if (price === 0)
                                await enrollMutation(
                                  { courseId: course?.id },
                                  {
                                    onSuccess: () => {
                                      MixPannelClient.getInstance().courseEnrolled(
                                        {
                                          courseId,
                                          userId: session?.data.user?.id ?? "",
                                        }
                                      );
                                      void ctx.enrollmentCourse.isEnrolled.invalidate();
                                      successToast(
                                        "Successfully enrolled in course!"
                                      );
                                    },
                                    onError: () => {
                                      errorToast(
                                        "Error in enrolling in course!"
                                      );
                                    },
                                  }
                                );
                              else setCheckoutModalOpen(true);
                            }}
                            className={`group my-1 inline-flex w-full items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-2 text-center text-2xl font-bold text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                          >
                            {enrollLoading ? (
                              <div>
                                <Loader white />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span>Enroll now</span>
                                {course?.startsAt &&
                                course?.startsAt?.getTime() >
                                  new Date().getTime() ? (
                                  <span className="text-sm font-medium">
                                    starts on{" "}
                                    <span className="font-bold uppercase">
                                      {course?.startsAt?.toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "short",
                                        }
                                      )}
                                    </span>
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>
                            )}
                          </button>
                          {course?.ytId ? (
                            <button
                              onClick={() => setPreviewOpen(true)}
                              className={`group my-1 inline-flex w-full items-center justify-center gap-[0.15rem] rounded-full border border-pink-500 px-6  py-2 text-center font-bold text-pink-500 transition-all duration-300 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600`}
                            >
                              <>
                                <PlayIcon className="w-4" />
                                <span>Preview</span>
                              </>
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    )
                  ) : (
                    <div className="flex w-full flex-col gap-1">
                      <div className="mt-2 h-4 w-20 animate-pulse rounded-lg bg-neutral-200/20" />
                      <div className="mt-2 h-8 w-40 animate-pulse rounded-xl bg-neutral-200/20" />
                      <div className="mt-2" />
                      <div className="mt-2 h-4 w-20 animate-pulse rounded-lg bg-neutral-200/20" />
                      <div className="mt-2 h-8 w-full animate-pulse rounded-xl bg-neutral-200/20" />
                    </div>
                  )}
                </motion.div>

                {course?.outcomes &&
                (course?.outcomes as string[]).length > 0 ? (
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 100 }}
                    transition={{ delay: 0.2, type: "tween" }}
                    className="mt-2 flex w-full flex-col items-start gap-4 rounded-lg border border-neutral-200/20 p-4 sm:mt-6 sm:w-auto"
                  >
                    <h3 className="text-base font-bold sm:text-lg">
                      What you&apos;ll learn
                    </h3>
                    <div className="grid w-full grid-cols-1 gap-3 gap-x-6 sm:w-auto sm:grid-cols-2">
                      {(course?.outcomes as string[])?.map((o, idx) => (
                        <div
                          key={`o-${idx}`}
                          className="flex items-center gap-2"
                        >
                          <CheckIcon className="w-5 min-w-[1.25rem] text-pink-600" />{" "}
                          <h4 className="text-neutral-100">{o}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>

              {scrollY <= 300 ? (
                <motion.div
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 100 }}
                  transition={{ delay: 0, type: "tween" }}
                  className="hidden sm:block"
                >
                  <BuyCourseBox
                    courseId={courseId}
                    creatorProfile={creatorProfile}
                    setCheckoutModalOpen={setCheckoutModalOpen}
                    setPreviewOpen={setPreviewOpen}
                  />
                </motion.div>
              ) : (
                <div className="hidden w-72 min-w-[18rem] sm:block" />
              )}
            </div>
          </div>
        </div>
        <div className="flex min-h-[60vh] w-full flex-col items-center">
          <div className="mt-8 flex w-full max-w-5xl gap-8">
            <div className="flex w-full flex-col items-start gap-4">
              {course?.description && course?.description.length > 0 ? (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  transition={{ delay: 0.25, type: "tween" }}
                  className="flex w-full flex-col"
                >
                  <div className="flex items-center gap-2 px-4 py-3 text-neutral-200">
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Description
                    </h2>
                  </div>
                  <div className="prose prose-invert prose-pink w-full min-w-full px-4 pb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {course?.description ?? ""}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <></>
              )}

              {course?.id === "cljsnzcld0001oy01pnas73bj" ? (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  transition={{ delay: 0.3, type: "tween" }}
                  className="flex w-full flex-col p-4"
                >
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Course Content
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <p>
                      <span className="font-bold">{modules.length}</span>{" "}
                      modules
                    </p>{" "}
                    •{" "}
                    <p>
                      <span className="font-bold">
                        {modules.reduce((chsLength, module) => {
                          return chsLength + module.chapters.length;
                        }, 0)}
                      </span>{" "}
                      chapters
                    </p>{" "}
                    •{" "}
                    <p>
                      <span className=" font-bold">
                        {(totalDuration / 60).toFixed(0)}
                      </span>{" "}
                      h
                      <span className="ml-1 font-bold">
                        {totalDuration % 60}
                      </span>{" "}
                      m total length
                    </p>
                  </div>

                  <div className="mt-4 flex w-full flex-col">
                    {modules.map((module, mIdx) => {
                      const mDuration = module.chapters.reduce(
                        (moduleDuration, chapter) => {
                          return moduleDuration + chapter.duration;
                        },
                        0
                      );

                      return (
                        <Disclosure key={`m-${mIdx}`} defaultOpen={mIdx === 0}>
                          {({ open }) => (
                            <div
                              className={`flex w-full flex-col border-l border-r border-t border-neutral-700 bg-neutral-200/5 backdrop-blur-sm duration-150 ${
                                mIdx === 0 ? "rounded-t" : ""
                              } ${
                                mIdx === modules.length - 1
                                  ? "rounded-b border-b"
                                  : ""
                              }`}
                            >
                              <Disclosure.Button className="z-10 w-full">
                                <div className="flex w-full items-center justify-start gap-3 p-3">
                                  <ChevronDownIcon
                                    className={`text-neutral-500 duration-150 ${
                                      open ? "rotate-180" : "rotate-0"
                                    } w-5 min-w-[1.25rem]`}
                                  />
                                  <h4 className="line-clamp-1 w-full overflow-hidden text-ellipsis text-left text-sm font-bold sm:text-base">
                                    {module.title}
                                  </h4>
                                  <div className="flex min-w-max items-center gap-1 text-xs">
                                    <p>{module.chapters.length} chapters</p> •{" "}
                                    <p>
                                      {mDuration / 60 > 0 ? (
                                        <span className="mr-1">
                                          {(mDuration / 60).toFixed(0)} h
                                        </span>
                                      ) : (
                                        <></>
                                      )}
                                      {mDuration % 60} m
                                    </p>
                                  </div>
                                </div>
                              </Disclosure.Button>
                              <Disclosure.Panel className="z-0 flex w-full flex-col border-t border-neutral-700 py-3">
                                {module.chapters.map((chapter, cIdx) => {
                                  const date = new Date();
                                  date.setHours(0);
                                  date.setMinutes(0);
                                  date.setSeconds(chapter.duration * 60);

                                  const hours = date
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                  const minutes = date
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0");
                                  const seconds = date
                                    .getSeconds()
                                    .toString()
                                    .padStart(2, "0");

                                  const formattedTime =
                                    hours === "00"
                                      ? `${minutes}:${seconds}`
                                      : `${hours}:${minutes}:${seconds}`;

                                  return (
                                    <div
                                      key={`c-${cIdx}`}
                                      className="flex w-full gap-3 px-4 py-2"
                                    >
                                      {chapter.type === "video" ? (
                                        <VideoCameraIcon className="w-4 min-w-[1rem]" />
                                      ) : (
                                        <DocumentTextIcon className="w-4 min-w-[1rem]" />
                                      )}
                                      <h5 className="line-clamp-1 w-full overflow-hidden text-ellipsis text-left text-sm">
                                        {chapter.title}
                                      </h5>
                                      <div className="flex min-w-max items-center gap-4 text-xs">
                                        {chapter.isPublic ? (
                                          <Link
                                            href="/"
                                            className="text-sm font-bold text-pink-600"
                                          >
                                            Preview
                                          </Link>
                                        ) : (
                                          <LockClosedIcon className="w-4" />
                                        )}
                                        <p>{formattedTime}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </Disclosure.Panel>
                            </div>
                          )}
                        </Disclosure>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <></>
              )}
            </div>

            <div className="hidden w-[18rem] min-w-[18rem] sm:block" />
          </div>
        </div>
      </CreatorLayout>
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
    </>
  );
};

type BProps = {
  creatorProfile: string;
  courseId: string;
  setCheckoutModalOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
};

const BuyCourseBox = ({
  courseId,
  creatorProfile,
  setCheckoutModalOpen,
  setPreviewOpen,
}: BProps) => {
  const session = useSession();
  const ctx = api.useContext();

  const { successToast, errorToast } = useToast();

  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.enrollmentCourse.enroll.useMutation();

  const { data: isEnrolled, isLoading: isEnrolledLoading } =
    api.enrollmentCourse.isEnrolled.useQuery({ courseId });

  const { data: course } = api.course.getCourse.useQuery({ id: courseId });

  if (!course) return <></>;

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
    <div className="relative hidden rounded-lg border border-white/10 bg-neutral-800/30 p-2 sm:block">
      {/* <div
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "repeat",
          backgroundImage:
            "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3CclipPath id=%22a%22%3E%3Cpath fill=%22currentColor%22 d=%22M745 642q-81 142-245.5 142.5T237 642.5q-98-142.5-8-299t302-211Q743 78 784.5 289T745 642Z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3Cg clip-path=%22url(%23a)%22%3E%3Cpath fill=%22%23ff47fe%22 d=%22M745 642q-81 142-245.5 142.5T237 642.5q-98-142.5-8-299t302-211Q743 78 784.5 289T745 642Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')",
        }}
        className="absolute -bottom-12 -left-12 -z-10 h-60 w-60 opacity-60 blur-2xl"
      />
      <div
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "repeat",

          backgroundImage:
            "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3CclipPath id=%22a%22%3E%3Cpath fill=%22currentColor%22 d=%22M786.5 682Q710 864 490 881.5t-263.5-182Q183 500 254 348.5t237-136Q657 228 760 364t26.5 318Z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3Cg clip-path=%22url(%23a)%22%3E%3Cpath fill=%22%23ff47c1%22 d=%22M786.5 682Q710 864 490 881.5t-263.5-182Q183 500 254 348.5t237-136Q657 228 760 364t26.5 318Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')",
        }}
        className="absolute -right-12 top-8 -z-10 h-60 w-60 opacity-60 blur-2xl"
      /> */}
      <div className="z-10 w-72 min-w-[18rem] flex-col gap-2 overflow-hidden rounded-lg border border-white/10 bg-neutral-800/30 drop-shadow">
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
                  className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                >
                  <>
                    <PlayIcon className="w-4" />
                    <span>Play</span>
                  </>
                </Link>
                <Link
                  href={`/creator/dashboard/course/${course?.id}`}
                  className={`group my-4 inline-flex items-center justify-center gap-1 rounded-full bg-pink-500/10 px-6 py-1  text-center font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200`}
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
                className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
              >
                <>
                  <PlayIcon className="w-4" />
                  <span>Play</span>
                </>
              </Link>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  {isDiscount ? (
                    discount === 0 ? (
                      <p
                        className={`text-xl font-bold uppercase tracking-widest text-green-500/80 sm:text-3xl`}
                      >
                        free
                      </p>
                    ) : (
                      <p
                        className={`font-bold uppercase tracking-wide  ${
                          !isDiscount
                            ? "text-base sm:text-lg"
                            : "text-xl font-black sm:text-3xl"
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
                      className={`text-xl font-bold uppercase tracking-widest text-green-500/80 sm:text-3xl`}
                    >
                      free
                    </p>
                  ) : (
                    <p
                      className={` font-semibold uppercase tracking-wide  ${
                        isDiscount
                          ? "text-base font-thin line-through decoration-1 sm:text-lg"
                          : "text-xl font-bold sm:text-3xl"
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

                <div className="mt-4 flex flex-col items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!session.data) {
                        void signIn(undefined, {
                          callbackUrl: `/${creatorProfile}/course/${courseId}`,
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
                    className={`group my-1 inline-flex w-full items-center justify-center gap-[0.15rem] rounded-full bg-pink-500 px-6 py-2 text-center font-bold text-neutral-200 transition-all duration-300 hover:bg-pink-600 sm:text-xl`}
                  >
                    {enrollLoading ? (
                      <div>
                        <Loader white />
                      </div>
                    ) : (
                      <button className="flex flex-col items-center">
                        <span>Enroll now</span>
                        {course?.startsAt &&
                        course?.startsAt?.getTime() > new Date().getTime() ? (
                          <span className="text-sm font-medium">
                            starts on{" "}
                            <span className="font-bold uppercase">
                              {course?.startsAt?.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </span>
                        ) : (
                          <></>
                        )}
                      </button>
                    )}
                  </button>
                  {course?.ytId ? (
                    <button
                      onClick={() => setPreviewOpen(true)}
                      className={`group my-1 inline-flex w-full items-center justify-center gap-[0.15rem] rounded-full border border-pink-500 px-6  py-2 text-center font-bold text-pink-500 transition-all duration-300 hover:border-pink-600 hover:bg-pink-600/10 hover:text-pink-600`}
                    >
                      <>
                        <PlayIcon className="w-4" />
                        <span>Preview</span>
                      </>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )
          ) : (
            <div className="flex w-full flex-col gap-1">
              <div className="mt-2 h-4 w-20 animate-pulse rounded-lg bg-neutral-700" />
              <div className="mt-2 h-8 w-40 animate-pulse rounded-xl bg-neutral-700" />
              <div className="mt-2" />
              <div className="mt-2 h-4 w-20 animate-pulse rounded-lg bg-neutral-700" />
              <div className="mt-2 h-8 w-full animate-pulse rounded-xl bg-neutral-700" />
            </div>
          )}
        </div>
      </div>
    </div>
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
  const creatorProfile = (context.params as CParams).creator_id;

  if (typeof courseId !== "string") throw new Error("no slug");

  await ssg.course.getCourse.prefetch({ id: courseId });
  await ssg.creator.getPublicProfile.prefetch({ creatorProfile });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      courseId,
      creatorProfile,
    },
  };
}

export default Index;
