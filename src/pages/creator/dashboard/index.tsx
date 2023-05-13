import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, type ReactNode } from "react";
import CalenderIcon from "@heroicons/react/20/solid/CalendarIcon";
import { CalendarIcon } from "@heroicons/react/24/outline";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import { UserGroupIcon as UserGroupIconO } from "@heroicons/react/24/outline";
import Cog6ToothIcon from "@heroicons/react/20/solid/Cog6ToothIcon";
import { Cog6ToothIcon as Cog6ToothIconO } from "@heroicons/react/24/outline";
import Bars3Icon from "@heroicons/react/20/solid/Bars3Icon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/20/solid/ArrowLeftOnRectangleIcon";
import UserPlusIcon from "@heroicons/react/20/solid/UserPlusIcon";
import CalenderDaysIcon from "@heroicons/react/20/solid/CalendarDaysIcon";
import ArrowUpRightIcon from "@heroicons/react/20/solid/ArrowUpRightIcon";
import { useRouter } from "next/router";
import { PresentationChartLineIcon } from "@heroicons/react/24/solid";
import { PresentationChartLineIcon as PresentationChartBarIcon0 } from "@heroicons/react/24/outline";

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
    if (creator && !creator?.isCreator) void router.push("/dashboard");
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
                    <Image
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
                    <Image
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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={` w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/event")
                      ? "flex"
                      : "hidden"
                  }`}
                >
                  <rect
                    x="1.25"
                    y="5.25"
                    width="21.5"
                    height="12.75"
                    rx="2.75"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M11.2812 10.3622L13.3497 11.5L11.2812 12.6377V10.3622Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/event")
                      ? "hidden"
                      : ""
                  }`}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4 6C2.89543 6 2 6.89543 2 8V15.25C2 16.3546 2.89543 17.25 4 17.25H20C21.1046 17.25 22 16.3546 22 15.25V8C22 6.89543 21.1046 6 20 6H4ZM11.0175 9.36111C10.7987 9.24094 10.5312 9.39903 10.5312 9.64869V13.3514C10.5313 13.4084 10.5462 13.4644 10.5744 13.5139C10.6027 13.5634 10.6434 13.6047 10.6925 13.6337C10.7415 13.6626 10.7973 13.6784 10.8543 13.6792C10.9113 13.6801 10.9675 13.6662 11.0175 13.6387L14.3833 11.7875C14.4347 11.7592 14.4776 11.7175 14.5075 11.667C14.5374 11.6164 14.5532 11.5588 14.5532 11.5C14.5532 11.4413 14.5374 11.3837 14.5075 11.3331C14.4776 11.2825 14.4347 11.2409 14.3833 11.2126L11.0175 9.36111Z"
                    fill="currentColor"
                  />
                  <rect
                    x="1.25"
                    y="5.25"
                    width="21.5"
                    height="12.75"
                    rx="2.75"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>

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
            <Link
              href="/creator/dashboard/events"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/event")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <CalendarIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/event")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <CalenderIcon
                  className={` w-6 ${
                    pathname && pathname.startsWith("/creator/dashboard/event")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Events</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/event")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
            <Link
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
            </Link>
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
                <span className="hidden md:block">Settings</span>
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
                          href="/creator/dashboard/registered-events"
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:pl-12 md:pr-8"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <CalenderDaysIcon className="w-4" />{" "}
                              <span className="hidden md:block">
                                Registered Events
                              </span>
                            </div>
                          </Menu.Item>
                        </Link>
                        <Link
                          href="/creator/dashboard/testimonials"
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:pl-12 md:pr-8"
                        >
                          <Menu.Item>
                            <div>
                              <span className="w-1/3" />

                              <div className="flex w-full items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                  className={`bi bi-chat-square-quote`}
                                >
                                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm7.194 2.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
                                </svg>
                                <span className="hidden md:block">
                                  Testimonials
                                </span>
                              </div>
                              <span
                                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                                  pathname &&
                                  pathname.startsWith(
                                    "/creator/dashboard/testimonials"
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                            </div>
                          </Menu.Item>
                        </Link>

                        <button
                          onClick={() => void signOut({ callbackUrl: "/" })}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:pl-12 md:pr-8"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <ArrowLeftOnRectangleIcon className="w-4" />{" "}
                              <span className="hidden md:block">Sign Out</span>{" "}
                            </div>
                          </Menu.Item>
                        </button>
                        <Link
                          href={`/${creator?.creatorProfile ?? ""}`}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:pl-12 md:pr-8"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <UserPlusIcon className="w-4" />{" "}
                              <span className="hidden md:block">
                                Public Profile
                              </span>{" "}
                            </div>
                          </Menu.Item>
                        </Link>
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
