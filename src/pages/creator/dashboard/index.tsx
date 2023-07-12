import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, type ReactNode } from "react";
import CalenderIcon from "@heroicons/react/20/solid/CalendarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import BanknotesIcon from "@heroicons/react/20/solid/BanknotesIcon";
import { BanknotesIcon as BanknotesIconO } from "@heroicons/react/24/outline";
import { UserGroupIcon as UserGroupIconO } from "@heroicons/react/24/outline";
import Cog6ToothIcon from "@heroicons/react/20/solid/Cog6ToothIcon";
import { Cog6ToothIcon as Cog6ToothIconO } from "@heroicons/react/24/outline";
import Bars3Icon from "@heroicons/react/20/solid/Bars3Icon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/20/solid/ArrowLeftOnRectangleIcon";
import WindowIcon from "@heroicons/react/20/solid/WindowIcon";
import ArrowUpRightIcon from "@heroicons/react/20/solid/ArrowUpRightIcon";
import { useRouter } from "next/router";
import {
  QuestionMarkCircleIcon,
  RectangleStackIcon,
} from "@heroicons/react/20/solid";
import { RectangleStackIcon as RectangleStackIconO } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return <div />;
}

Dashboard.getLayout = DashboardLayout;

function DashboardLayoutR({ children }: { children: ReactNode }) {
  const { data: creator } = api.creator.getProfile.useQuery();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (router.pathname === "/creator/dashboard")
      void router.push("/creator/dashboard/courses");
    if (creator && !creator?.isCreator) void router.replace("/dashboard");
  }, [creator, router]);

  return (
    <main className="flex h-screen w-full justify-center overflow-x-hidden">
      <div className="flex h-full w-full items-start">
        <div className="fixed z-20 flex h-full flex-col items-center justify-start gap-8 bg-neutral-900 pb-12 pt-8 text-neutral-400 md:w-60">
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
              href="/creator/dashboard/courses"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/course")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <RectangleStackIconO
                  className={`w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/course")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <RectangleStackIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/course")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Courses</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/course")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            {/* <Link
              href="/creator/dashboard/marketing"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/marketing")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <PresentationChartBarIcon0
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/marketing")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <PresentationChartLineIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/marketing")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Marketing</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname &&
                  pathname.startsWith("/creator/dashboard/marketing")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link> */}
            <Link
              href="/creator/dashboard/audience"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/audience")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <UserGroupIconO
                  className={` w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/audience")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <UserGroupIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/audience")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Audience</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/audience")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
              href="/creator/dashboard/payment"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/payment")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <BanknotesIconO
                  className={` w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/payment")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <BanknotesIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/payment")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Payments</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/payment")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
              href="/creator/dashboard/settings"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/settings")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <Cog6ToothIconO
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/settings")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <Cog6ToothIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/settings")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Profile</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/settings")
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
                          href={`/creator/dashboard/testimonials`}
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
                        <Link
                          href={`/creator/dashboard/events`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <CalenderIcon className={` w-4`} />{" "}
                              <span className="hidden md:block">Events</span>{" "}
                            </div>
                          </Menu.Item>
                        </Link>
                        <Link
                          href={`/creator/dashboard/queries`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <QuestionMarkCircleIcon className={`w-4`} />{" "}
                              <span className="hidden md:block">Queries</span>{" "}
                            </div>
                          </Menu.Item>
                        </Link>
                        <Link
                          href={`/dashboard`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <WindowIcon className="w-4" />{" "}
                              <span className="hidden md:block">Dashboard</span>{" "}
                            </div>
                          </Menu.Item>
                        </Link>
                        {/* <Link
                          href={`/${creator?.creatorProfile ?? ""}`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:px-12"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <UserIcon className="w-4" />{" "}
                              <span className="hidden md:block">
                                Public Profile
                              </span>{" "}
                            </div>
                          </Menu.Item>
                        </Link> */}
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
