import { EventCard } from "@/components/EventCard";
import { type Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ImageWF from "@/components/ImageWF";
import Layout from "@/components/layouts/main";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import { ClaimLinkBanner } from "..";
import Link from "next/link";
import {
  Bars3Icon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  type ChartData,
  type TooltipItem,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MixPannelClient } from "@/analytics/mixpanel";
import { Fragment, useEffect } from "react";
import ContinueLearningCard from "@/components/ContinueLearningCard";
import { Menu, Transition } from "@headlessui/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: profile, isLoading } = api.creator.getProfile.useQuery();
  const { data: pastRegisteredEvents, isLoading: isPastLoading } =
    api.creator.getPastEvents.useQuery();
  const { data: enrollments, isLoading: enrollmentsLoading } =
    api.enrollmentCourse.getEnrollments.useQuery();

  const { data: lastWeekLearning, isLoading: lastWeekLearningLoading } =
    api.tracking.getPastWeek.useQuery();

  const isPastTab = router.query.events === "past";
  const upcomingEvents = profile?.registrations;
  const pastEvents = pastRegisteredEvents;
  const events = isPastTab ? pastEvents : upcomingEvents;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 5,
        borderWidth: 2,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => `${value} m`,
          stepSize: 5,
        },
        beginAtZero: true,
        grace: 2,
      },
      x: {
        ticks: {
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: (val: string | number) => {
            // Hide every 2nd tick label
            return lastWeekLearning
              ? lastWeekLearning[val as number]?.date?.toLocaleString("en-US", {
                  weekday: "short",
                })
              : "-";
          },
        },
      },
      // x1: {
      //   ticks: {
      //     // For a category axis, the val is the index so the lookup via getLabelForValue is needed
      //     callback: (val: string | number) => {
      //       // Hide every 2nd tick label
      //       return lastWeekLearning
      //         ? lastWeekLearning[val as number]?.date?.toLocaleString("en-US", {
      //             day: "numeric",
      //             month: "short",
      //           })
      //         : "";
      //     },
      //   },
      // },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            return `Minutes Learned: ${
              (lastWeekLearning ?? [])[tooltipItem.dataIndex]?.minutes ?? 0
            }`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  interface ChartContext {
    ctx: CanvasRenderingContext2D;
  }

  const data: ChartData<"line", number[], string> = {
    labels:
      lastWeekLearning?.map((lwl) =>
        lwl.date.toLocaleString("en-US", { weekday: "short" })
      ) ?? [],
    datasets: [
      {
        fill: true,
        label: "Minutes learned in previous week",
        data: lastWeekLearning?.map((lwl) => lwl.minutes) ?? [],
        borderColor: "#db2777",
        backgroundColor: ({ chart: { ctx } }: { chart: ChartContext }) => {
          const bg = ctx.createLinearGradient(0, 150, 0, 600);
          bg.addColorStop(0, "rgba(236, 72, 153,0.15)");
          bg.addColorStop(0.18, "rgba(236, 72, 153,0)");
          bg.addColorStop(1, "transparent");

          return bg;
        },
        pointBorderColor: "#171717",

        pointBackgroundColor: "#db2777",

        cubicInterpolationMode: "monotone",
      },
    ],
  };

  useEffect(() => {
    MixPannelClient.getInstance().dashboardViewed();
  }, []);

  useEffect(() => {
    if (isPastTab) MixPannelClient.getInstance().pastEventTabViewed();
  }, [isPastTab]);

  return (
    <Layout>
      <div className="flex w-full flex-col px-4 py-2">
        <Head>
          <title>Dashboard | Kroto</title>
        </Head>
        <div className="flex items-start justify-center gap-8">
          <div className="flex w-full max-w-3xl flex-col gap-4 sm:gap-8">
            <AnimatedSection className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="flex items-center justify-between">
                <div className="flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
                  <div className="flex w-full items-start justify-between gap-5">
                    <div className="flex items-center gap-5">
                      <div className="relative aspect-square w-16 object-cover  sm:w-24">
                        <ImageWF
                          fill
                          alt={session?.user.name ?? ""}
                          className="aspect-square w-28 rounded-full object-cover"
                          src={session?.user.image ?? ""}
                        />
                      </div>

                      <p className="flex flex-col">
                        <span className="block text-sm text-neutral-400 sm:text-base">
                          Welcome back,
                        </span>
                        <span className="text-lg font-medium text-neutral-200 sm:text-3xl">
                          {session?.user.name}
                        </span>
                        <span className="block text-sm text-neutral-400 sm:text-base">
                          You&apos;re looking nice today!
                        </span>
                      </p>
                    </div>

                    <Menu
                      as="div"
                      className="relative left-0 inline-block text-left sm:hidden"
                    >
                      {() => (
                        <div className="flex flex-col items-end">
                          <Menu.Button>
                            <Bars3Icon className="w-6" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 top-8 mt-2 flex origin-top-right flex-col divide-y divide-neutral-200/20 overflow-hidden rounded-xl bg-neutral-200/5 backdrop-blur-sm duration-300">
                              <Menu.Item>
                                <Link
                                  href="/dashboard/queries"
                                  className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                                >
                                  Queries
                                </Link>
                              </Menu.Item>

                              <Menu.Item>
                                <Link
                                  className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                                  href="/dashboard/testimonials"
                                >
                                  Testimonial
                                </Link>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </div>
                      )}
                    </Menu>
                  </div>
                  <div className="hidden flex-col items-center gap-3 sm:flex">
                    <Link
                      href="/dashboard/queries"
                      className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
                    >
                      <QuestionMarkCircleIcon className="w-4" /> Queries
                    </Link>
                    <Link
                      href="/dashboard/testimonials"
                      className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
                    >
                      <FontAwesomeIcon icon={faQuoteLeft} /> Testimonials
                    </Link>

                    {/* <button
                      disabled
                      className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-500 disabled:text-neutral-500 disabled:hover:bg-transparent sm:min-w-[10rem]"
                    >
                      <GlobeAltIcon className="w-4" /> Your Public Page
                    </button> */}
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <div className="flex w-full max-w-3xl flex-col lg:hidden">
              <AnimatedSection
                delay={0.1}
                className="flex w-full flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:gap-4  sm:p-4"
              >
                <h1 className="text-base font-medium text-neutral-200 sm:text-lg">
                  Learning Graph
                </h1>
                {lastWeekLearningLoading ? (
                  <div className="flex h-60 flex-col items-center justify-center">
                    <Loader size="lg" />
                  </div>
                ) : (
                  <div className="relative h-60 w-full sm:h-60">
                    <Line options={options} data={data} />
                  </div>
                )}
              </AnimatedSection>
            </div>

            <AnimatedSection
              delay={0.2}
              className="flex w-full flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4  sm:p-8"
            >
              <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
                  Continue Learning
                </h1>
                <Link
                  href="/dashboard/courses"
                  className="rounded-lg border border-neutral-600 bg-neutral-200/10 px-2 py-1 text-xs font-bold text-neutral-400 duration-150 hover:text-neutral-200"
                >
                  Show all Courses
                </Link>
              </div>

              <div className="flex w-full flex-col items-center">
                {enrollmentsLoading ? (
                  <div className="flex h-64 items-center justify-center">
                    <Loader size="lg" />
                  </div>
                ) : (
                  <>
                    {enrollments && enrollments?.length > 0 ? (
                      <>
                        <div className="my-2 flex w-full flex-col items-center gap-4">
                          {enrollments?.slice(0, 2)?.map((enrollment, idx) => (
                            <ContinueLearningCard
                              key={enrollment.id}
                              enrollment={enrollment}
                              defaultOpen={idx === 0}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                        <div className="relative aspect-square w-40 object-contain">
                          <ImageWF
                            src="/empty/course_empty.svg"
                            alt="empty"
                            fill
                          />
                        </div>
                        <p className="mb-2 text-center text-neutral-400 sm:text-left">
                          You have not enrolled in any course.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection
              delay={0.3}
              className="flex w-full flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4 sm:p-8"
            >
              <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
                <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
                  Registered Events
                </h1>
                <div className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                  <ul className="-mb-px flex flex-wrap">
                    <li className="mr-2">
                      <Link
                        href="/dashboard"
                        className={`inline-block rounded-t-lg p-4 ${
                          !isPastTab
                            ? "border-b-2 border-pink-500 text-pink-500 transition"
                            : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                        }`}
                      >
                        Upcoming
                      </Link>
                    </li>
                    <li className="/creator/dashboard/events">
                      <Link
                        href="/dashboard?events=past"
                        className={`inline-block rounded-t-lg p-4 transition ${
                          isPastTab
                            ? "border-b-2 border-pink-500 text-pink-500"
                            : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                        }`}
                        aria-current="page"
                      >
                        Past
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {(isPastTab ? isPastLoading : isLoading) ? (
                <div className="flex h-full items-center justify-center">
                  <Loader size="lg" />
                </div>
              ) : (
                <>
                  {events && events.length > 0 ? (
                    <>
                      <div className="my-2 flex flex-col gap-2">
                        {events?.map((e) => (
                          <div key={e.id ?? ""}>
                            <EventCard event={e} />
                          </div>
                        ))}
                      </div>
                      {/* <div className="mx-5 mb-2 flex justify-between">
                    <button className="text-pink-500 transition hover:text-pink-600">
                      View More
                    </button>
                    <button className="text-pink-500 transition hover:text-pink-600">
                      Show past
                    </button>
                  </div> */}
                    </>
                  ) : (
                    <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                      <div className="relative aspect-square w-40 object-contain">
                        <ImageWF
                          src="/empty/event_empty.svg"
                          alt="empty"
                          fill
                        />
                      </div>
                      <p className="mb-2 text-center text-neutral-400 sm:text-left">
                        {isPastTab
                          ? "You don't have any past registered events."
                          : "You don't have any upcoming registered events."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </AnimatedSection>
            <ClaimLinkBanner />
          </div>

          <div className="hidden w-full max-w-md flex-col lg:flex">
            <AnimatedSection
              delay={0.1}
              className="mb-10 flex w-full flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-2 sm:gap-4  sm:p-4"
            >
              <h1 className="text-sm font-medium text-neutral-200 sm:text-lg">
                Learning Graph
              </h1>
              {lastWeekLearningLoading ? (
                <div className="flex h-60 flex-col items-center justify-center">
                  <Loader size="lg" />
                </div>
              ) : (
                <div className="relative h-60 w-full sm:h-60">
                  <Line options={options} data={data} />
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const creators = await getCreators();

  return {
    props: { creators },
  };
}

export const CreatorCard = ({ creator }: { creator: Creator }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => void router.push(`/${creator.id}`)}
      className="my-10 cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-neutral-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <ImageWF
            width={80}
            height={80}
            className="aspect-square w-28 rounded-full"
            src={creator?.image_url ?? ""}
            alt={creator?.name ?? ""}
          />
          <div>
            <h3 className="mb-1 text-3xl font-medium text-neutral-200">
              {creator.name}
            </h3>
            <p className="text-neutral-400">{creator.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
