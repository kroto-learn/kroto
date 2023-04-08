"use client";

import { type CourseEvent } from "interfaces/CourseEvent";
import { getEventsClient } from "mock/getEventsClient";
// import { getEventsClient } from "mock/getEventsClient";
// import { getEventsClient } from "mock/getEventsClient";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode, useState } from "react";
import { BsGlobe } from "react-icons/bs";

type Props = {
  children: ReactNode;
  params: { id: string };
};

export default function EventLayout({ children, params }: Props) {
  const [event, setEvent] = useState<CourseEvent | undefined>(undefined);

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEventsClient();
      const mEvent = events.find((e) => e.id === params.id);
      if (mEvent) setEvent(mEvent);
    };
    void loadEvent();
  }, [params]);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <h1 className="text-2xl text-neutral-200">{event?.title}</h1>
        <Link
          href={`/event/${params.id}`}
          className="flex items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <BsGlobe /> Event Public Page
        </Link>
      </div>
      <div className="border-b border-neutral-200 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${params.id}`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname === `/creator/dashboard/event/${params.id}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${params.id}/registrations`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname ===
                `/creator/dashboard/event/${params.id}/registrations`
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
              href={`/creator/dashboard/event/${params.id}/settings`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname === `/creator/dashboard/event/${params.id}/settings`
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