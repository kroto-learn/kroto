import Link from "next/link";
import { useRouter } from "next/router";
import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const DashboardEventsTabWrapper = ({ children }: Props) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <h1 className="text-2xl text-neutral-200">Events</h1>
      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href="/creator/dashboard/events"
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath === "/creator/dashboard/events"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent  hover:border-gray-300 hover:text-gray-300"
              }`}
            >
              Upcoming
            </Link>
          </li>
          <li className="/creator/dashboard/events">
            <Link
              href="/creator/dashboard/events/past"
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath === "/creator/dashboard/events/past"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent  hover:border-gray-300 hover:text-gray-300"
              }`}
              aria-current="page"
            >
              Past
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
};

export default DashboardEventsTabWrapper;
