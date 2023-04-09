import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import HeroImage from "/public/hero_image.png";
import Image from "next/image";

import { HiArrowSmRight } from "react-icons/hi";
import { useRouter } from "next/router";
import Layout from "@/components/layouts/main";
import { Loader } from "@/components/Loader";
import ClaimLink from "@/components/ClaimLink";
import {
  BsCalendarEventFill,
  BsCardChecklist,
  BsListCheck,
} from "react-icons/bs";
import { FaListAlt, FaMoneyBill } from "react-icons/fa";
import { AiFillDatabase } from "react-icons/ai";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Kroto - Learn Collectively</title>
        <meta
          name="description"
          content="Collective learning with the creators you love"
        />
      </Head>

      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="claim-link">
        <ClaimLinkBanner />
      </div>
    </Layout>
  );
};

export default Home;

export function Hero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="my-20">
      <div className="mx-auto flex w-full flex-col gap-10 px-2 sm:px-6 md:max-w-7xl lg:px-8">
        <div className="flex h-full flex-col pt-10 sm:pt-16 lg:pt-0">
          <div className="mx-auto max-w-lg sm:max-w-4xl sm:px-4 sm:text-center lg:flex lg:items-center lg:pl-0 lg:text-left">
            <div className="">
              <h1 className="relative max-w-4xl text-center text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl">
                <span className="block">Unlocking the potential of</span>
                <span className="block pb-3 text-pink-500 sm:pb-5">
                  YouTube Education
                </span>
              </h1>
              <p className="relative my-5 text-center text-base text-neutral-300 sm:text-xl lg:text-lg xl:text-2xl">
                We help YouTube educators monetize their content and provide
                students with a seamless learning experience
              </p>
              <div className="mt-6 flex justify-center sm:mt-8">
                <div className="sm:mx-auto sm:max-w-xl lg:mx-0">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-center lg:justify-start">
                    <button
                      onClick={() => {
                        void (session?.user
                          ? router.push("/dashboard")
                          : void signIn());
                      }}
                      className={`group inline-flex items-center gap-[0.15rem] rounded-xl bg-pink-600 px-6 py-2 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
                    >
                      {status === "loading" && <Loader />}
                      {session?.user
                        ? "Go to dashboard"
                        : "Become a Kreator now"}
                      <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="h-96 bg-gradient-to-t to-neutral-950/ object-cover md:h-1/2 xl:h-2/3">
            <Image
              src={HeroImage}
              className="transition duration-700 hover:scale-105"
              alt="Hero Image"
            />
          </div> */}
          <img
            className="h-96 bg-gradient-to-t from-neutral-950 object-cover md:h-1/2 xl:h-2/3"
            src="/hero_image.png"
            alt="crap"
          />
        </div>
      </div>
    </div>
  );
}

export const Features = () => {
  return (
    <div className="relative mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <h2 className="text-center text-3xl font-extrabold leading-8 tracking-tight sm:text-4xl">
          Modern Education Platform for Professional Creators
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-neutral-400">
          Content creation is hard. Making money while doing so is even harder.
          Kroto helps creators monetize their content and provides a seamless
          learning experience for their students.
        </p>
      </div>
      <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Monetize your audience with ease
          </h3>
          <p className="mt-3 text-lg text-neutral-400">
            We&apos;re built for creators who are serious about sharing their
            knowledge, and do that scalably so that you can focus on what you
            do.
          </p>
          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <BsCalendarEventFill />
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Live events to filter your audience
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Live events are a great way to connect with your audience and
                filter out the crowd with the ones who truly care.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <FaListAlt />
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Create courses for a cohort of students{" "}
                  <span className="rounded-full border border-pink-600 bg-pink-500 p-1 text-xs text-pink-200">
                    Upcoming
                  </span>
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Recorded courses are fine, but live courses are a lot better.
                You can create and manage cohort based courses for the select
                few who are serious about learning from you.
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true"></div>
      </div>
      <div className="relative mt-12 sm:mt-16 lg:mt-24">
        <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="lg:col-start-2">
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Actionable analytics to help you grow
            </h3>
            <p className="mt-3 text-lg text-neutral-400">
              Getting to a 10k subscriber count is a mamoth task, it&apos;s hard
              still to make a living out of it. We&apos;ve built analytics to
              help you grow your audience and make more money.
            </p>
            <dl className="mt-10 space-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                    <AiFillDatabase />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6">
                    Database of audience who really care
                  </p>
                </dt>
                <dd className="ml-16 mt-2 text-base text-neutral-400">
                  It is really hard to know who the active part of your audience
                  who don&apos;t just watch your videos and leave. Wehelp you
                  build a database of your audience who are truely interested in
                  your content.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                    <FaMoneyBill />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6">
                    Paying audience is important
                  </p>
                </dt>
                <dd className="ml-16 mt-2 text-base text-neutral-400">
                  We help you identify the audience who won&apos;t mind
                  supporting you to get the best of the content, which is
                  exclusive and help you support yourself to keep creating.
                </dd>
              </div>
            </dl>
          </div>
          <div
            className="relative mt-10 px-4 lg:col-start-1 lg:mt-0 lg:pl-0 lg:pr-8"
            aria-hidden="true"
          ></div>
        </div>
      </div>
      <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Targeted marketing is the key
          </h3>
          <p className="mt-3 text-lg text-neutral-400">
            Giving a call to action to a random audience is not going to help, a
            targetted marketing strategy is important to convert your audience
            into paying customers.
          </p>
          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white"></div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Newsletters to target your audience
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Every caller has a feed of their own - just drop a URL in a
                browser source and you&apos;re set.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white"></div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Send custom emails to the database we help you build
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Want separate layers for every caller? We got you. How about the
                entire call with nameplates visible? Done. VTubers with a green
                screened background? Just add your usual chroma key filters.
              </dd>
            </div>
          </dl>
        </div>
        <div
          className="relative mt-10 px-4 lg:mt-0 lg:px-0"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};

export const ClaimLinkBanner = () => (
  <div className="my-10 overflow-hidden border-y border-neutral-800 bg-neutral-950 px-0 py-10 md:px-24">
    <div className="mx-auto flex w-full flex-col items-center justify-between gap-10 text-center md:max-w-7xl lg:text-left xl:flex-row">
      <div className="text-3xl">
        Become a{" "}
        <span className="text-pink-500 transition duration-300 hover:text-pink-600">
          Kreator
        </span>{" "}
        now, and claim your kreator proflie
      </div>
      <div>
        <div className="hidden lg:block">
          <ClaimLink variant="lg" />
        </div>
        <div className="hidden md:block lg:hidden">
          <ClaimLink variant="md" />
        </div>
        <div className="block md:hidden">
          <ClaimLink variant="sm" />
        </div>
      </div>
    </div>
  </div>
);
