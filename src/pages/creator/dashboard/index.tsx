import { api } from "@/utils/api";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { BiLogOut } from "react-icons/bi";
import {
  BsCalendarEvent,
  BsCalendarEventFill,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";
import { RiSettings3Line, RiSettings3Fill } from "react-icons/ri";

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
        <div className="fixed mt-5 flex h-[96%] flex-col items-center justify-start gap-8 rounded-xl bg-neutral-900 py-12 text-neutral-400 md:w-60">
          {creator ? (
            <>
              <Link
                href={`/${creator?.creatorProfile ?? ""}`}
                className="h-16 w-16 p-2 md:hidden"
              >
                <div
                  className={`relative h-full w-full overflow-hidden rounded-full`}
                >
                  <Image
                    src={creator?.image ?? ""}
                    alt={creator?.name ?? ""}
                    fill
                  />
                </div>
              </Link>
              <div className="hidden w-full flex-col items-center gap-3 px-4 md:flex">
                <div
                  className={`relative aspect-square w-24 overflow-hidden rounded-full`}
                >
                  <Image
                    src={creator?.image ?? ""}
                    alt={creator?.name ?? ""}
                    fill
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="font-medium text-neutral-200">{creator.name}</p>
                  <Link
                    href={`/${creator?.creatorProfile ?? ""}`}
                    className="flex items-center text-xs font-medium text-neutral-300 decoration-neutral-400 underline-offset-2 hover:underline"
                  >
                    kroto.in/{creator?.creatorProfile}{" "}
                    <FiArrowUpRight className="text-lg text-pink-600" />
                  </Link>
                </div>
              </div>
            </>
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
              className={`group flex h-12 w-full cursor-pointer items-center justify-between gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/event")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1" />
              <div className="flex items-center gap-2">
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
              className={`group flex h-12 w-full cursor-pointer items-center justify-between gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/audience")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1" />
              <div className="flex items-center gap-2">
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
              className={`group flex h-12 w-full cursor-pointer items-center justify-between gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/creator/dashboard/settings")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1" />

              <div className="flex items-center gap-2">
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
          </div>
          <button
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 text-sm text-neutral-200 transition duration-300 hover:text-neutral-400"
          >
            <BiLogOut /> Sign Out
          </button>
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
