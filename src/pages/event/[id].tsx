import CalenderBox from "@/components/CalenderBox";
import Head from "next/head";
import Image from "next/image";
import { SiGooglemeet } from "react-icons/si";
import { api } from "@/utils/api";
import { MdLocationOn } from "react-icons/md";
import { type GetStaticPropsContext } from "next";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { type ParsedUrlQuery } from "querystring";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loader } from "@/components/Loader";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import {
  ArrowRightIcon,
  Bars3CenterLeftIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Layout from "@/components/layouts/main";

type Props = {
  eventId: string;
};

export default function EventPage({ eventId }: Props) {
  const { data: event } = api.event.get.useQuery({
    id: eventId,
  });

  const { data: session } = useSession();

  const date = event?.datetime ?? new Date();
  const ctx = api.useContext();

  const endTime = event?.datetime
    ? new Date(event?.datetime.getTime() + 3600000)
    : new Date();

  const registerMuatioan = api.event.register.useMutation().mutateAsync;
  const { data: isRegistered, isLoading } = api.event.isRegistered.useQuery({
    eventId,
  });

  const { errorToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const isEventOver =
    (event?.endTime ?? new Date()).getTime() < new Date().getTime();

  const isEventNow =
    (event?.datetime ?? new Date())?.getTime() <= new Date().getTime() &&
    (event?.endTime ?? new Date()).getTime() >= new Date().getTime();

  const isEventInAnHour =
    (event?.datetime ?? new Date()).getTime() <=
      new Date().getTime() + 3600000 &&
    (event?.endTime ?? new Date()).getTime() >= new Date().getTime();

  const isYourEvent = event?.creatorId === session?.user?.id;

  const { mutateAsync: addToCalendarMutation, isLoading: addingToCalendar } =
    api.calendar.addUserEvent.useMutation();

  return (
    <Layout>
      <Head>
        <title>{event?.title}</title>
        <meta property="og:title" content={event?.title ?? ""} />
        <meta property="og:description" content={event?.description ?? ""} />
        <meta
          property="og:image"
          itemProp="image"
          content={event?.thumbnail ?? ""}
        />
        <meta
          property="og:url"
          content={`https://kroto.in/event/${event?.id ?? ""}`}
        />
      </Head>
      <main className="-mt-10 flex h-full min-h-screen w-full flex-col items-center gap-8 overflow-x-hidden py-12">
        <div className="flex w-11/12 max-w-4xl flex-col gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="relative aspect-[18/9] w-full">
            <Image
              src={(event?.thumbnail as string) ?? ""}
              alt={event?.title ?? ""}
              className="rounded-xl object-cover shadow-md"
              fill
            />
          </div>
          <h1 className="mb-5 text-2xl font-medium text-neutral-200">
            {event?.title}
          </h1>
          <div className="flex flex-row justify-between gap-1">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`relative aspect-square w-[1.3rem] overflow-hidden rounded-full`}
                >
                  <Image
                    src={event?.creator?.image ?? ""}
                    alt="Rose Kamal Love"
                    fill
                  />
                </div>
                <p
                  className={`text-xs text-neutral-300 transition-all sm:text-base`}
                >
                  Hosted by{" "}
                  <Link href={`/${event?.creator?.creatorProfile ?? ""}`}>
                    {event?.creator?.name ?? ""}
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                {event?.eventType === "virtual" ? (
                  <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-4xl text-neutral-400" />
                ) : (
                  <MdLocationOn className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-4xl text-neutral-400" />
                )}
                <p>
                  {event?.eventType === "virtual"
                    ? "Google Meet"
                    : event?.eventLocation}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <CalenderBox date={event?.datetime ?? new Date()} />
                <p className="text-left text-xs font-medium  text-neutral-300 sm:text-sm">
                  {date?.toLocaleString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  <br />
                  {date?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  to{" "}
                  {endTime?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              {isYourEvent ? (
                <Link
                  href={`/creator/dashboard/event/${event?.id ?? ""}`}
                  target="_blank"
                  className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500/20 px-4 py-2 text-center text-xs font-medium text-pink-600 transition-all duration-300 hover:bg-pink-500 hover:text-neutral-200`}
                >
                  <AdjustmentsHorizontalIcon className="w-4" /> Manage Event
                </Link>
              ) : isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader />
                </div>
              ) : isEventOver ? (
                <div className="flex items-center justify-center font-bold">
                  The event has ended.
                </div>
              ) : isRegistered ? (
                event?.eventType === "virtual" ? (
                  isEventNow ? (
                    <div className="flex items-center justify-center gap-2 font-bold">
                      The event is live!{" "}
                      <Link
                        href={event?.eventUrl ?? ""}
                        target="_blank"
                        className={`group inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/20 px-4 py-2 text-center text-xs font-medium text-pink-600 transition-all duration-300 hover:bg-pink-500 hover:text-neutral-200`}
                      >
                        Join Now <ArrowUpRightIcon className="w-4" />
                      </Link>
                    </div>
                  ) : isEventInAnHour ? (
                    <div className="flex items-center justify-center font-bold">
                      The event is going to start soon, stay tuned!
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-pink flex items-center justify-center font-bold">
                      <button
                        onClick={async () => {
                          await addToCalendarMutation({
                            eventId: event?.id ?? "",
                          });
                        }}
                      >
                        {addingToCalendar ? (
                          <a>Sending...</a>
                        ) : (
                          <a>Send a calendar invite</a>
                        )}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center font-bold">
                    You are already registered!
                  </div>
                )
              ) : (
                <button
                  onClick={async () => {
                    setLoading(true);
                    if (!session) {
                      errorToast("You're not logged in");
                      void router.push(
                        `/auth/sign-in/?redirect=/event/${eventId}`
                      );
                    }
                    await registerMuatioan({ eventId });
                    void ctx.event.isRegistered.invalidate();
                    setLoading(false);
                  }}
                  className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem]  py-2 text-center text-lg font-medium text-neutral-200 transition-all duration-300`}
                >
                  {loading ? (
                    <div>
                      <Loader white />
                    </div>
                  ) : (
                    <>
                      <span>Register now</span>
                      <ArrowRightIcon className="w-5 text-xl duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-4xl ">
          <div className="flex w-full flex-col-reverse items-start gap-4 md:flex-row">
            <div className="mx-auto flex w-11/12 flex-col gap-4 rounded-xl bg-neutral-800 md:w-2/3">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <Bars3CenterLeftIcon className="w-5" />
                <h2 className="font-medium ">Description</h2>
              </div>
              <div className="prose prose-invert prose-pink px-4 pb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event?.description ?? ""}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mx-auto flex w-11/12 flex-col gap-4 rounded-xl bg-neutral-800 md:w-1/3">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <UserGroupIcon className="w-5" />
                <h2 className="font-medium ">Hosts</h2>
              </div>
              <div className="flex flex-wrap gap-5 px-4 pb-4">
                {event?.hosts.map((host) => (
                  <Link
                    href={`/${host?.creatorProfile ?? ""}`}
                    key={host?.id}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative aspect-square w-[1.7rem] overflow-hidden rounded-full`}
                    >
                      <Image
                        src={host?.image ?? ""}
                        alt={host?.name ?? ""}
                        fill
                      />
                    </div>
                    <p className={`text-neutral-300 transition-all`}>
                      {host?.name ?? ""}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

interface CParams extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = generateSSGHelper();
  const eventId = (context.params as CParams).id;

  if (typeof eventId !== "string") throw new Error("no slug");

  await ssg.event.get.prefetch({ id: eventId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      eventId,
    },
  };
}
