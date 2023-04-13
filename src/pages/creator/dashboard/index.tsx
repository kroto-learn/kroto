import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  BsCalendarEvent,
  BsCalendarEventFill,
  BsChevronDown,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";
import { MdEventAvailable } from "react-icons/md";
import {
  RiSettings3Line,
  RiSettings3Fill,
  RiUserFollowFill,
} from "react-icons/ri";

export default function Dashboard() {
  return <div />;
}

Dashboard.getLayout = DashboardLayout;

function DashboardLayoutR({ children }: { children: ReactNode }) {
  const { data: creator } = api.creator.getProfile.useQuery();

  const pathname = usePathname();

  return (
    <main className="flex h-screen w-full justify-center overflow-x-hidden">
      <div className="flex h-full w-full max-w-4xl items-start">
        <div className="fixed z-20 mt-5 flex h-[96%] flex-col items-center justify-start gap-8 rounded-xl bg-neutral-900 pb-12 pt-8 text-neutral-400 md:w-60">
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
                    <p className="text-sm font-medium text-neutral-200">
                      {creator.name}
                    </p>
                    <div className="flex items-center truncate text-xs font-medium text-neutral-300 decoration-neutral-400">
                      {creator?.creatorProfile}{" "}
                      <FiArrowUpRight className="text-lg text-pink-600" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <div className="h-16 w-16 p-4 md:hidden">
                <div className={`h-full w-full rounded-full bg-neutral-800`} />
              </div>
              <div className="hidden w-full flex-col items-center gap-3 rounded-full px-4 duration-300 hover:border-neutral-600 md:flex">
                <div
                  className={`relative aspect-square w-24 overflow-hidden rounded-full  bg-neutral-800`}
                />
                <div className="flex flex-col items-center gap-1">
                  <div className="my-1 h-4 w-32 rounded-lg bg-neutral-800" />
                  <div className="my-1 h-4 w-40 rounded-lg  bg-neutral-800" />
                </div>
              </div>
            </>
          )}
          <div className="flex w-full flex-grow flex-col items-center">
            <Link
              href="/creator/dashboard/events"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/event")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex w-full items-center gap-2">
                <BsCalendarEvent
                  className={` ${
                    pathname && pathname.startsWith("/creator/dashboard/event")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <BsCalendarEventFill
                  className={`${
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
              href="/creator/dashboard/audience"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/audience")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />

              <div className="flex w-full items-center gap-2">
                <BsPeople
                  className={`${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/audience")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <BsPeopleFill
                  className={`${
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
                <RiSettings3Line
                  className={`${
                    pathname &&
                    pathname.startsWith("/creator/dashboard/settings")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <RiSettings3Fill
                  className={`${
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
                      {open ? <BsChevronDown /> : <GiHamburgerMenu />}
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
                              <MdEventAvailable />{" "}
                              <span className="hidden md:block">
                                Registered Events
                              </span>
                            </div>
                          </Menu.Item>
                        </Link>

                        <button
                          onClick={() => void signOut({ callbackUrl: "/" })}
                          className="flex h-12 w-full items-center justify-center font-medium transition duration-300 hover:bg-neutral-700/30 hover:text-pink-500 md:justify-start md:pl-12 md:pr-8"
                        >
                          <Menu.Item>
                            <div className="flex items-center gap-2 text-xl md:text-sm">
                              <BiLogOut />{" "}
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
                              <RiUserFollowFill />{" "}
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
        <div className="ml-12 w-full md:ml-[15rem]">{children}</div>
      </div>
    </main>
  );
}

function DashboardLayout(page: ReactNode) {
  return <DashboardLayoutR>{page}</DashboardLayoutR>;
}

export { DashboardLayout };
