"use client";

import { getEventsClient } from "mock/getEventsClient";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: { id: string };
};

export default async function EventLayout({ children, params }: Props) {
  const pathname = usePathname();
  const events = await getEventsClient();
  const event = events.find((e) => e.id === params.id);

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <h1 className="text-2xl text-neutral-200">{event?.title}</h1>
      <div className="border-b border-neutral-200 text-center text-sm font-medium text-neutral-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${event?.id as string}`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname === `/creator/dashboard/event/[id]}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${
                event?.id as string
              }/registrations`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname ===
                `/creator/dashboard/event/${event?.id as string}/registrations`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Registrations
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${event?.id as string}/settings`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname ===
                `/creator/dashboard/event/${event?.id as string}/settings`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}
