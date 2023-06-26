import { api } from "@/utils/api";
import { signOut } from "next-auth/react";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import {
  AdjustmentsHorizontalIcon,
  InboxStackIcon,
  LightBulbIcon,
  RectangleStackIcon,
  TagIcon,
} from "@heroicons/react/20/solid";
import { LightBulbIcon as LightBulbIconO } from "@heroicons/react/24/outline";
import { InboxStackIcon as InboxStackIconO } from "@heroicons/react/24/outline";
import { RectangleStackIcon as RectangleStackIconO } from "@heroicons/react/24/outline";
import { TagIcon as TagIconO } from "@heroicons/react/24/outline";

import { isAdmin } from "@/server/helpers/admin";

export default function Dashboard() {
  return <div />;
}

Dashboard.getLayout = AdminDashboardLayout;

function AdminDashboardLayoutR({ children }: { children: ReactNode }) {
  const { data: creator } = api.creator.getProfile.useQuery();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (router.pathname === "/admin/dashboard")
      void router.push("/admin/dashboard/courses");
    if (creator && !isAdmin(creator?.email ?? "")) void router.replace("/");
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
                    <div className="flex items-center text-xs font-bold uppercase tracking-wider decoration-neutral-400">
                      <AdjustmentsHorizontalIcon className="mr-1 w-4 text-pink-600" />
                      <span className="max-w-[7.5rem] truncate">admin</span>
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
              href="/admin/dashboard/courses"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/admin/dashboard/course")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <RectangleStackIconO
                  className={`w-6 ${
                    pathname && pathname.startsWith("/admin/dashboard/course")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <RectangleStackIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/admin/dashboard/course")
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

            <Link
              href="/admin/dashboard/categories"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/admin/dashboard/categories")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <InboxStackIconO
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/admin/dashboard/categories")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <InboxStackIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/admin/dashboard/categories")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Categories</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname &&
                  pathname.startsWith("/creator/dashboard/categories")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>

            <Link
              href="/admin/dashboard/tags"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname && pathname.startsWith("/admin/dashboard/tags")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <TagIconO
                  className={`w-6 ${
                    pathname && pathname.startsWith("/admin/dashboard/tags")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <TagIcon
                  className={`w-6 ${
                    pathname && pathname.startsWith("/admin/dashboard/tags")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Tags</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname && pathname.startsWith("/creator/dashboard/tags")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>

            <Link
              href="/admin/dashboard/suggested-courses"
              className={`group flex h-12 w-full cursor-pointer grid-cols-3 gap-3 text-xl transition duration-200 ease-linear hover:bg-neutral-700/50 ${
                pathname &&
                pathname.startsWith("/admin/dashboard/suggested-courses")
                  ? "text-pink-500"
                  : "hover:text-neutral-200"
              }`}
            >
              <span className="w-1/3" />
              <div className="flex  w-full items-center gap-2">
                <LightBulbIconO
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/admin/dashboard/suggested-courses")
                      ? "hidden"
                      : ""
                  }`}
                />{" "}
                <LightBulbIcon
                  className={`w-6 ${
                    pathname &&
                    pathname.startsWith("/admin/dashboard/suggested-courses")
                      ? "flex"
                      : "hidden"
                  }`}
                />{" "}
                <span className="hidden md:block">Suggestions</span>
              </div>
              <span
                className={`h-full w-1 rounded-l-lg bg-pink-600 ${
                  pathname &&
                  pathname.startsWith("/creator/dashboard/suggested-courses")
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
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

function AdminDashboardLayout(page: ReactNode) {
  return <AdminDashboardLayoutR>{page}</AdminDashboardLayoutR>;
}

export { AdminDashboardLayout };
