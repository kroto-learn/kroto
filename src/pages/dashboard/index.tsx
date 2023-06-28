import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";
import CalenderIcon from "@heroicons/react/20/solid/CalendarIcon";
import { CalendarIcon } from "@heroicons/react/24/outline";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import AnimatedSection from "@/components/AnimatedSection";
import { UserGroupIcon as UserGroupIconO } from "@heroicons/react/24/outline";
import Bars3Icon from "@heroicons/react/20/solid/Bars3Icon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { Loader } from "@/components/Loader";
import { GlobeAltIcon } from "@heroicons/react/20/solid";
import ArrowLeftOnRectangleIcon from "@heroicons/react/20/solid/ArrowLeftOnRectangleIcon";
import ArrowUpRightIcon from "@heroicons/react/20/solid/ArrowUpRightIcon";
import { useRouter } from "next/router";
import { Line } from "react-chartjs-2";
import Head from "next/head";
import { MixPannelClient } from "@/analytics/mixpanel";
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
import { RectangleStackIcon } from "@heroicons/react/20/solid";
import { RectangleStackIcon as RectangleStackIconO } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { type ReactNode } from "react";
import ImageWF from "@/components/ImageWF";
import { api } from "@/utils/api";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  const { data: lastWeekLearning, isLoading: lastWeekLearningLoading } =
    api.tracking.getPastWeek.useQuery();

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

  return (
    <main>
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
      </div>
    </main>
  );
}

Dashboard.getLayout = DashboardLayout;

function DashboardLayoutR({ children }: { children: ReactNode }) {
  const { data: creator } = api.creator.getProfile.useQuery();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (creator && !creator?.isCreator) void router.replace("/dashboard");
  }, [creator, router]);

  return (
    <main className="flex h-screen w-full justify-center overflow-x-hidden">
      <div className="flex h-full w-full max-w-4xl items-start">
        <div className="fixed z-20 flex h-full flex-col items-center justify-start gap-8 bg-neutral-900 pb-12 pt-8 text-neutral-400 sm:mt-5 sm:h-[96%] sm:rounded-xl md:w-60">
          {creator ? (
            <div className="flex w-full justify-center p-0 md:p-4">
              <Link
                href={`/${creator?.creatorProfile ?? ""}`}
                className="flex w-full justify-center rounded-xl p-0 duration-300 md:bg-neutral-800  md:p-2 md:hover:bg-neutral-700"
              >
                <div className="h-16 w-16 p-2 md:hidden">
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-full`}
                  >
                    <ImageWF
                      src={creator?.image ?? ""}
                      alt={creator?.name ?? ""}
                      fill
                    />
                  </div>
                </div>
                <div className="hidden w-full gap-3 md:flex">
                  <div
                    className={`relative aspect-square h-[2.5rem] overflow-hidden rounded-full`}
                  >
                    <ImageWF
                      src={creator?.image ?? ""}
                      alt={creator?.name ?? ""}
                      fill
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <p className="max-w-[8rem] truncate text-sm font-medium text-neutral-200">
                      {creator.name}
                    </p>
                    <div className="flex items-center text-xs font-medium text-neutral-300 decoration-neutral-400">
                      <span className="max-w-[7.5rem] truncate">
                        {creator?.creatorProfile}
                      </span>{" "}
                      <ArrowUpRightIcon className="w-4 text-pink-600" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex w-full justify-center p-0 md:p-4">
                <div className="flex w-full justify-center rounded-xl p-0 duration-300 md:bg-neutral-800 md:p-2">
                  <div className="h-16 w-16 overflow-hidden  p-2 md:hidden">
                    <div className="h-full w-full rounded-full bg-neutral-800"></div>
                  </div>
                  <div className="h-[2.5rem]"></div>
                </div>
              </div>
            </>
          )}
          <div className="flex w-full flex-grow flex-col items-center">
            <Link
              href="/dashboard"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname === "/dashboard"
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <RectangleStackIconO
                  className={`w-6 ${
                    pathname && pathname === "/dashboard" ? "hidden" : ""
                  }`}
                />{" "}
                <RectangleStackIcon
                  className={`w-6 ${
                    pathname && pathname === "/dashboard" ? "flex" : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Dashboard</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname === "/dashboard"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
              href="/dashboard/courses"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/dashboard/courses")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <CalendarIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/dashboard/courses")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <CalenderIcon
                  className={` w-6 ${
                    pathname && pathname.startsWith("/dashboard/courses")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Courses</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/dashboard/courses")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
              href="/dashboard/events"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/dashboard/events")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <UserGroupIconO
                  className={` w-6 ${
                    pathname && pathname.startsWith("/dashboard/events")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <UserGroupIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/dashboard/events")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Events</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/dashboard/events")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
              href="/courses"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-lg transition duration-200 ease-linear hover:bg-neutral-700/50`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <UserGroupIconO className={` w-6 `} />{" "}
                <span className="hidden md:block">Discover</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/queries")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button className="flex h-12 w-full grid-cols-3 items-center gap-3 text-xl transition duration-300 hover:bg-neutral-800 hover:text-pink-500 active:bg-neutral-800  active:text-pink-500">
                    <span className="w-1/3" />
                    <div className="flex w-full items-center justify-start gap-2 transition-transform duration-300">
                      {open ? (
                        <ChevronDownIcon className="w-6" />
                      ) : (
                        <Bars3Icon className="w-6" />
                      )}
                      <span className="hidden md:block">More</span>
                    </div>
                    <span className="w-1" />
                  </Menu.Button>
                  <div className="flex w-full flex-col items-center md:p-2">
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="flex w-full flex-col overflow-hidden rounded-lg bg-neutral-800 transition-all duration-300">
                        <Link
                          href={`/dashboard/testimonials`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <FontAwesomeIcon icon={faQuoteLeft} />{" "}
                              <span className="hidden md:block">
                                Testimonials
                              </span>{" "}
                            </div>
                          </Menu.Item>
                        </Link>
                        <button
                          onClick={() => void signOut({ callbackUrl: "/" })}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <ArrowLeftOnRectangleIcon className="w-4" />{" "}
                              <span className="hidden md:block">Sign Out</span>{" "}
                            </div>
                          </Menu.Item>
                        </button>
                      </Menu.Items>
                    </Transition>
                  </div>
                </>
              )}
            </Menu>
          </div>
          <button
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 text-sm text-neutral-200 transition duration-300 hover:text-neutral-400"
          ></button>
        </div>
        <div className="ml-12 w-[90%] md:ml-[15rem]">{children}</div>
      </div>
    </main>
  );
}

function DashboardLayout(page: ReactNode) {
  return <DashboardLayoutR>{page}</DashboardLayoutR>;
}

export { DashboardLayout };
