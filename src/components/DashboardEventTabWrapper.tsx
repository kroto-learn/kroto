import { type CourseEvent } from "interfaces/CourseEvent";
import { getEventsClient } from "mock/getEventsClient";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, type ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const DashboardEventTabWrapper = ({ children }: Props) => {
  const router = useRouter();
  const [event, setEvent] = useState<CourseEvent | undefined>(undefined);

  useEffect(() => {
    const loadEvents = async () => {
      const events = await getEventsClient();
      const matchedEvent = events.find((e) => e.id === router.query.id);
      matchedEvent && setEvent(matchedEvent);
    };
    void loadEvents();
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <h1 className="text-2xl text-neutral-200">{event?.title}</h1>
      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${router.query.id as string}`}
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath ===
                `/creator/dashboard/event/${router.query.id as string}`
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent  hover:border-gray-300 hover:text-gray-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${
                router.query.id as string
              }/registrations`}
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath ===
                `/creator/dashboard/event/${
                  router.query.id as string
                }/registrations`
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent  hover:border-gray-300 hover:text-gray-300"
              }`}
              aria-current="page"
            >
              Registrations
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${
                router.query.id as string
              }/settings`}
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                router.asPath ===
                `/creator/dashboard/event/${router.query.id as string}/settings`
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent  hover:border-gray-300 hover:text-gray-300"
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
};

export default DashboardEventTabWrapper;
