import CourseEventCard from "@/components/CourseEventCard";
import SocialLink from "@/components/SocialLink";
import type { Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import type { GetStaticPropsContext } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import Image from "next/image";
import { getEvents } from "mock/getEvents";
import { getCourses } from "mock/getCourses";
import type { CourseEvent } from "interfaces/CourseEvent";
import Link from "next/link";

type CreatorPageProps = {
  creator: Creator;
  hostedCourses: CourseEvent[];
  hostedEvents: CourseEvent[];
};

const Index = ({ creator, hostedCourses, hostedEvents }: CreatorPageProps) => {
  return (
    <>
      <Head>
        <title>{creator.name + " - Kroto"}</title>
      </Head>
      <main className="flex h-full min-h-screen w-full flex-col items-center overflow-x-hidden pb-24">
        <div className="relative my-6 flex w-full max-w-4xl flex-col items-center p-4 lg:items-start">
          <div className="absolute z-[2] lg:left-32">
            <div
              className={`relative aspect-square w-28 overflow-hidden  rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
            >
              <Image src={creator.image_url} alt={creator.name} fill />
            </div>
          </div>
          <div
            className={`mt-[3.7rem] flex w-full flex-col items-center justify-between gap-4 rounded-xl bg-neutral-800 px-8 pb-8 pt-16 backdrop-blur-lg transition-all duration-300 lg:flex-row lg:px-12 lg:pb-12 lg:pt-16`}
          >
            <div
              className={`flex w-full max-w-xl items-center  justify-start gap-6 transition-all duration-300`}
            >
              <div
                className={`flex flex-col items-start gap-4 transition-all duration-300`}
              >
                <h1
                  className={`text-center text-2xl font-medium text-neutral-200 transition-all duration-300 lg:text-left`}
                >
                  {creator.name}
                </h1>
                <p
                  className={`text-center text-neutral-400 transition-all  duration-300 lg:text-left`}
                >
                  {creator.bio}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  {creator.links.map((link) => (
                    <SocialLink
                      collapsed={true}
                      key={link.href}
                      href={link.href}
                      type={link.type}
                    >
                      {link?.text}
                    </SocialLink>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`mt-4 flex w-full flex-col items-end gap-2 lg:mt-0`}
            >
              <div
                className={`flex w-full flex-col items-center gap-4 transition-all duration-300`}
              >
                {hostedCourses.map((course) =>
                  course?.featured ? (
                    <CourseEventCard
                      collapsed={true}
                      key={course.title}
                      courseevent={course}
                    />
                  ) : (
                    <></>
                  )
                )}
                {hostedEvents.map((event) =>
                  event.featured ? (
                    <CourseEventCard
                      collapsed={true}
                      key={event.title}
                      courseevent={event}
                    />
                  ) : (
                    <></>
                  )
                )}
                <Link
                  href={creator.topmate_url}
                  target="_blank"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-500 bg-neutral-200/10 px-4 py-2 pr-[1.2rem] text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-neutral-200 hover:bg-[#E44332] hover:text-neutral-200"
                >
                  <div className="group relative h-4 w-4">
                    <Image
                      src="/topmate_logo.png"
                      alt="topmate"
                      fill
                      className="opacity-70 group-hover:opacity-100"
                    />
                  </div>{" "}
                  Schedule a 1:1 call
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8 flex flex-col items-start justify-start gap-8 p-8">
          <h2 className="text-2xl text-neutral-200">Upcoming Events</h2>
          <div className="flex flex-col gap-12">
            {hostedEvents.map((event) => (
              <CourseEventCard
                creator={creator}
                key={event.title}
                courseevent={event}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const creators = await getCreators();

  return {
    paths: creators.map((c) => ({
      params: {
        creator_id: c.id,
      },
    })),
    fallback: "blocking",
  };
}

interface CParams extends ParsedUrlQuery {
  creator_id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const creators = await getCreators();
  const courses = await getCourses();
  const events = await getEvents();

  const creator = creators.find(
    (c: Creator) => c.id === (context.params as CParams).creator_id
  );

  const hostedEvents = events.filter((c: CourseEvent) => {
    return c.creator === (context.params as CParams).creator_id;
  });
  const hostedCourses = courses.filter(
    (c: CourseEvent) => c.creator === (context.params as CParams).creator_id
  );

  if (!creator)
    return {
      notFound: true,
    };

  return {
    props: { creator, hostedCourses, hostedEvents },
  };
}

export default Index;
