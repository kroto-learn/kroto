import CalenderBox from "@/components/CalenderBox";
import Head from "next/head";
import Image from "next/image";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglemeet } from "react-icons/si";
import { GrTextAlignLeft } from "react-icons/gr";
import { IoPeopleOutline } from "react-icons/io5";
import { api } from "@/utils/api";
import { MdLocationOn } from "react-icons/md";
import { type GetStaticPropsContext } from "next";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { type ParsedUrlQuery } from "querystring";

type Props = {
  eventId: string;
};

export default function EventPage({ eventId }: Props) {
  const { data: event } = api.event.get.useQuery({
    id: eventId,
  });

  const { data: creator } = api.creator.getPublicProfile.useQuery({
    creatorId: event?.creatorId ?? "",
  });
  const date = event?.datetime ?? new Date();

  const endTime = event?.datetime
    ? new Date(event?.datetime.getTime() + 3600000)
    : new Date();

  return (
    <>
      <Head>
        <title>{event?.title}</title>
      </Head>
      <main className="flex h-full min-h-screen w-full flex-col items-center gap-8 overflow-x-hidden py-12">
        <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="relative h-[25rem] w-full">
            <Image
              src={(event?.thumbnail as string) ?? ""}
              alt={event?.title ?? ""}
              className="rounded-xl shadow-md shadow-black"
              fill
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-medium text-neutral-200">
                {event?.title}
              </h1>

              <div className="flex items-center gap-2">
                <div
                  className={`relative aspect-square w-[1.3rem] overflow-hidden rounded-full`}
                >
                  <Image
                    src={creator?.thumbnail ?? ""}
                    alt="Rose Kamal Love"
                    fill
                  />
                </div>
                <p className={`text-sm text-neutral-300 transition-all`}>
                  Hosted by {creator?.name ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                {event?.eventType === "virtual" ? (
                  <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />
                ) : (
                  <MdLocationOn className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />
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
                <CalenderBox date={new Date()} />
                <p className="text-left text-sm  font-medium text-neutral-300">
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

              <button
                className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem]  py-2 text-center text-lg font-medium text-neutral-200 transition-all duration-300`}
              >
                Register now
                <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-3xl">
          <div className="flex w-full items-start gap-4">
            <div className="flex w-2/3 flex-col gap-4 rounded-xl bg-neutral-800">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <GrTextAlignLeft />
                <h2 className="font-medium ">Description</h2>
              </div>
              <p className="px-4 pb-4 text-neutral-300">{event?.description}</p>
            </div>
            <div className="flex w-1/3 flex-col gap-4 rounded-xl bg-neutral-800">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <IoPeopleOutline />
                <h2 className="font-medium ">Hosts</h2>
              </div>
              <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`relative aspect-square w-[1.7rem] overflow-hidden rounded-full`}
                  >
                    <Image
                      src={creator?.image ?? ""}
                      alt={creator?.name ?? ""}
                      fill
                    />
                  </div>
                  <p className={`text-neutral-300 transition-all`}>
                    {creator?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
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
