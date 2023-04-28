import { EventCard } from "@/components/EventCard";
import SocialLink from "@/components/SocialLink";
import type { GetStaticPropsContext } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import Image from "next/image";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

import { Loader } from "@/components/Loader";

type CreatorPageProps = {
  creatorProfile: string;
};

const Index = ({ creatorProfile }: CreatorPageProps) => {
  const { data: creator, isLoading } = api.creator.getPublicProfile.useQuery({
    creatorProfile,
  });

  if (!creator) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-neutral-200">
          Creator not found
        </h1>
        <Link
          href="/"
          className="mt-4 flex items-center gap-2 text-xl font-medium text-pink-500 transition duration-300 hover:text-pink-600"
        >
          <ArrowLeftIcon className="w-6" />
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${creator?.name ?? ""} - Kroto`}</title>
        <meta name="description" content={creator?.bio ?? ""} />

        {/* Google SEO */}
        <meta itemProp="name" content={creator?.name ?? ""} />
        <meta itemProp="description" content={creator?.bio ?? ""} />
        <meta
          itemProp="image"
          content={`https://kroto.in/api/og/creator?name=${
            creator?.name ?? ""
          }&image=${creator?.image ?? ""}&creatorProfile=${
            creator?.creatorProfile ?? ""
          }`}
        />
        {/* facebook meta */}
        <meta property="og:title" content={`${creator?.name} | Kroto` ?? ""} />
        <meta property="og:description" content={creator?.bio ?? ""} />
        <meta
          property="og:image"
          content={`https://kroto.in/api/og/creator?name=${
            creator?.name ?? ""
          }&image=${creator?.image ?? ""}&creatorProfile=${
            creator?.creatorProfile ?? ""
          }`}
        />
        <meta
          property="image"
          content={`https://kroto.in/api/og/creator?name=${
            creator?.name ?? ""
          }&image=${creator?.image ?? ""}&creatorProfile=${
            creator?.creatorProfile ?? ""
          }`}
        />
        <meta
          property="og:url"
          content={`https://kroto.in/${creator?.creatorProfile ?? ""}`}
        />
        <meta property="og:type" content="website" />

        {/* twitter meta */}
        <meta name="twitter:title" content={creator?.name ?? ""} />
        <meta name="twitter:description" content={creator?.bio ?? ""} />
        <meta
          name="twitter:image"
          content={`https://kroto.in/api/og/creator?name=${
            creator?.name ?? ""
          }&image=${creator?.image ?? ""}&creatorProfile=${
            creator?.creatorProfile ?? ""
          }`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className="flex h-full min-h-screen w-full flex-col items-center overflow-x-hidden p-4 pb-24">
        <div className="relative mt-6 flex w-full max-w-2xl flex-col items-center">
          <div className="absolute z-[2]">
            <div
              className={`relative aspect-square w-28 overflow-hidden  rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
            >
              <Image
                src={creator?.image ?? ""}
                alt={creator?.name ?? ""}
                fill
              />
            </div>
          </div>
          <div
            className={`mt-[3.7rem] flex w-full flex-col items-center justify-between gap-[1.5rem] rounded-3xl bg-neutral-900 px-16 pb-32 pt-16 backdrop-blur-lg transition-all duration-300`}
          >
            <h1
              className={`text-center text-2xl font-medium text-neutral-200 transition-all duration-300 lg:text-left`}
            >
              {creator?.name}
            </h1>
            <p
              className={`text-center text-sm text-neutral-400 transition-all duration-300  sm:text-base`}
            >
              {creator?.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {creator?.socialLinks?.map((link) => (
                <SocialLink
                  collapsed={true}
                  key={link.url}
                  href={link.url}
                  type={link.type}
                ></SocialLink>
              ))}
            </div>
            {creator?.topmateUrl && creator?.topmateUrl !== "" ? (
              <Link
                href={creator?.topmateUrl ?? ""}
                target="_blank"
                className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-neutral-500 bg-neutral-200/10 px-4 py-2 pr-[1.2rem] text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-neutral-200 hover:bg-[#E44332] hover:text-neutral-200"
              >
                <div className="group relative h-4 w-4">
                  <Image
                    src="/topmate_logo.png"
                    alt="topmate"
                    fill
                    className="opacity-70 group-hover:opacity-100"
                  />
                </div>
                Schedule a 1:1 call
              </Link>
            ) : (
              <></>
            )}
            {creator?.topmateUrl && creator?.topmateUrl !== "" ? (
              <Link
                href={`/${creator?.creatorProfile ?? ""}/testimonial`}
                className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-neutral-500 bg-neutral-200/10 px-4 py-2 pr-[1.2rem] text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-neutral-200 hover:bg-pink-500 hover:text-neutral-200"
              >
                <ChatBubbleBottomCenterIcon className="w-6" />
                Write a Testimonial for me
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex w-full max-w-2xl -translate-y-24 flex-col items-center justify-start gap-8 rounded-3xl bg-neutral-800 p-8">
          <h2 className="text-lg font-medium uppercase tracking-wider text-neutral-200">
            Upcoming Events
          </h2>
          {isLoading ? (
            <Loader size="lg" />
          ) : creator.events && creator.events.length > 0 ? (
            <div className="flex w-full flex-col items-center gap-4">
              {creator?.events?.map((event) => (
                <EventCard key={event?.id ?? ""} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
              <div className="relative aspect-square w-40 object-contain">
                <Image src="/empty/event_empty.svg" alt="empty" fill />
              </div>
              <p className="mb-2 text-neutral-400">
                The creater has not created any events.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

interface CParams extends ParsedUrlQuery {
  creator_id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = generateSSGHelper();
  const creatorProfile = (context.params as CParams).creator_id;

  if (typeof creatorProfile !== "string") throw new Error("no slug");

  await ssg.creator.getPublicProfile.prefetch({ creatorProfile });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      creatorProfile,
    },
  };
}

export default Index;
