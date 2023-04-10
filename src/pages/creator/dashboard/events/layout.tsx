"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { GoPlus } from "react-icons/go";

function EventsLayoutR({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    console.log("I got remounted");
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <h1 className="text-2xl text-neutral-200">Events</h1>
        <Link
          href="/event/create"
          className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <GoPlus /> Create Event
        </Link>
      </div>
      <div className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href="/creator/dashboard/events"
              className={`inline-block rounded-t-lg p-4 ${
                pathname === "/creator/dashboard/events"
                  ? "border-b-2 border-pink-500 text-pink-500 transition"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
            >
              Upcoming
            </Link>
          </li>
          <li className="/creator/dashboard/events">
            <Link
              href="/creator/dashboard/events/past"
              className={`inline-block rounded-t-lg p-4 transition ${
                pathname === "/creator/dashboard/events/past"
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
      {children}
    </div>
  );
}

export default function EventsLayout(page: ReactNode) {
  return <EventsLayoutR>{page}</EventsLayoutR>;
}
