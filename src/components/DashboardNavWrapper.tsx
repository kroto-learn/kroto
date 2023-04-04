import { type Creator } from "interfaces/Creator";
import { getCreatorsClient } from "mock/getCreatorsClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, type ReactNode, useState } from "react";
import {
  BsCalendarEvent,
  BsCalendarEventFill,
  BsPeople,
  BsPeopleFill,
} from "react-icons/bs";
import { RiSettings3Line, RiSettings3Fill } from "react-icons/ri";

type Props = {
  children: ReactNode;
};

const DashboardNavWrapper = ({ children }: Props) => {
  const [creator, setCreator] = useState<Creator | undefined>(undefined);

  useEffect(() => {
    const loadEvents = async () => {
      const creators = await getCreatorsClient();
      const matchedCreator = creators.find((c) => c.id === "@rosekamallove");
      matchedCreator && setCreator(matchedCreator);
    };
    void loadEvents();
  }, []);

  const router = useRouter();

  return (
    <main className="relative flex h-full min-h-screen w-full items-center overflow-x-hidden">
      <div className="absolute left-0 top-0 flex h-full w-4/12 justify-end bg-neutral-800">
        <div className="flex w-full max-w-[16rem] flex-col items-start justify-between gap-8 px-2 py-12">
          <div className="flex w-full flex-col gap-3">
            <Link
              href="/creator/dashboard/events"
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xl transition  hover:bg-neutral-700/50 ${
                router.asPath.startsWith("/creator/dashboard/event")
                  ? "text-pink-600"
                  : ""
              }`}
            >
              <BsCalendarEvent
                className={` ${
                  router.asPath.startsWith("/creator/dashboard/event")
                    ? "hidden"
                    : ""
                }`}
              />{" "}
              <BsCalendarEventFill
                className={`${
                  router.asPath.startsWith("/creator/dashboard/event")
                    ? "flex"
                    : "hidden"
                }`}
              />{" "}
              Events
            </Link>
            <Link
              href="/creator/dashboard/audience"
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xl transition  hover:bg-neutral-700/50 ${
                router.asPath.startsWith("/creator/dashboard/audience")
                  ? "text-pink-600"
                  : ""
              }`}
            >
              <BsPeople
                className={`${
                  router.asPath.startsWith("/creator/dashboard/audience")
                    ? "hidden"
                    : ""
                }`}
              />{" "}
              <BsPeopleFill
                className={`${
                  router.asPath.startsWith("/creator/dashboard/audience")
                    ? "flex"
                    : "hidden"
                }`}
              />{" "}
              Audience
            </Link>
            <Link
              href="/creator/dashboard/settings"
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xl transition hover:bg-neutral-700/50 ${
                router.asPath.startsWith("/creator/dashboard/settings")
                  ? "text-pink-600"
                  : ""
              }`}
            >
              <RiSettings3Line
                className={`${
                  router.asPath.startsWith("/creator/dashboard/settings")
                    ? "hidden"
                    : ""
                }`}
              />{" "}
              <RiSettings3Fill
                className={`${
                  router.asPath.startsWith("/creator/dashboard/settings")
                    ? "flex"
                    : "hidden"
                }`}
              />{" "}
              Settings
            </Link>
          </div>
          {creator && (
            <Link
              href={`/${creator.id}`}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-full border border-neutral-700 px-1 py-1 duration-300 hover:border-neutral-600"
            >
              <div
                className={`relative aspect-square w-12 overflow-hidden  rounded-full`}
              >
                <Image src={creator.image_url} alt={creator.name} fill />
              </div>
              <div className="group flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-200">
                  {creator.name}
                </p>
                <p className="text-xs text-neutral-300 decoration-neutral-400 underline-offset-2 group-hover:underline">
                  kroto.in/{creator.id}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="absolute right-0 top-0 w-8/12">{children}</div>
    </main>
  );
};

export default DashboardNavWrapper;
