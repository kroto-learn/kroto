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
import { GlobeAltIcon } from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MixPannelClient } from "@/analytics/mixpanel";
import { useEffect } from "react";

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
    Legend
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
        },
        beginAtZero: true,
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
      x1: {
        ticks: {
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: (val: string | number) => {
            // Hide every 2nd tick label
            return lastWeekLearning
              ? lastWeekLearning[val as number]?.date?.toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                })
              : "";
          },
        },
      },
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
      <div className="flex w-full flex-col items-center px-4">
        <Head>
          <title>Dashboard | Kroto</title>
        </Head>
        <AnimatedSection className="my-10 w-full max-w-4xl rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <ImageWF
                  width={80}
                  height={80}
                  alt={session?.user.name ?? ""}
                  className="aspect-square w-28 rounded-full"
                  src={session?.user.image ?? ""}
                />
                <p className="flex flex-col items-center sm:items-start">
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
              <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
                <Link
                  href="/dashboard/testimonials"
                  className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
                >
                  <FontAwesomeIcon icon={faQuoteLeft} /> Testimonials
                </Link>
                <Link
                  href="/dashboard/queries"
                  className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
                >
                  <FontAwesomeIcon icon={faQuoteLeft} /> Queries
                </Link>
                <button
                  disabled
                  className="flex items-center justify-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-500 disabled:text-neutral-500 disabled:hover:bg-transparent sm:min-w-[10rem]"
                >
                  <GlobeAltIcon className="w-4" /> Your Public Page
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection
          delay={0.1}
          className="mb-10 flex w-full max-w-4xl flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4  sm:p-8"
        >
          <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
            Learning Graph
          </h1>
          {lastWeekLearningLoading ? (
            <div className="flex h-60 flex-col items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="relative h-60 w-full sm:h-80">
              <Line options={options} data={data} />
            </div>
          )}
        </AnimatedSection>
        <AnimatedSection
          delay={0.2}
          className="mb-10 flex w-full max-w-4xl flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4  sm:p-8"
        >
          <h1 className="text-lg font-medium text-neutral-200 sm:text-2xl">
            Enrolled Courses
          </h1>
          <div className="flex w-full flex-col items-center">
            {enrollmentsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                {enrollments && enrollments?.length > 0 ? (
                  <>
                    <div className="my-2 flex w-full flex-col items-center gap-2">
                      {enrollments?.map((enrollment) => (
                        <EnrolledCourseCard
                          key={enrollment.id}
                          enrollment={enrollment}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                    <div className="relative aspect-square w-40 object-contain">
                      <ImageWF src="/empty/course_empty.svg" alt="empty" fill />
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
          className="mb-10 flex w-full max-w-4xl flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:gap-4 sm:p-8"
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
                    <ImageWF src="/empty/event_empty.svg" alt="empty" fill />
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
