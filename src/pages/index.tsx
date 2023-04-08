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
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
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
                students with a seamless learning experience.
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
          <div className="relative ">
            <Image
              src={HeroImage}
              className="transition duration-700 hover:scale-105"
              alt="Hero Image"
            />
          </div>
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
          Modern education platform built for professional creators
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-neutral-400">
          Content creation is hard. Making money while doing so is even harder.
          We built Kroto to help creators monetize their content and provide a
          seamless learning experience for their students.
        </p>
      </div>
      <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Keeps you looking your best
            <span className="text-neutral-400">for LSF</span>
          </h3>
          <p className="mt-3 text-lg text-neutral-400">
            We&apos;re built for high-end cameras and mics, not 7 year old
            phones and earbuds. You&apos;ll see the difference instantly.
          </p>
          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  High definition by default
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Low Latency coast to coast
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                When we say live, we mean it. Latency in Ping is often under ⅓
                of the competition. No more awkward pauses or cutoffs, Ping
                feels more like IRL than anything else.
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
              Easier than cheating
              <span className="text-neutral-400">in TF2</span>
            </h3>
            <p className="mt-3 text-lg text-neutral-400">
              Getting your guests onto your show is as easy as sending them a
              link. No more leaked join codes - you can see who&apos;s joining
              by their Twitch username.
            </p>
            <dl className="mt-10 space-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6">
                    Secure by design
                  </p>
                </dt>
                <dd className="ml-16 mt-2 text-base text-neutral-400">
                  We don&apos;t screw around with your safety on stream. All
                  users are authenticated with Twitch, Twitter or Youtube, so
                  you know the person joining is the person you invited.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      ></path>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6">
                    Layouts built for broadcast
                  </p>
                </dt>
                <dd className="ml-16 mt-2 text-base text-neutral-400">
                  Our default layouts are built around creation, not call
                  participation. That means no more frames moving around when
                  you don&apos;t want them to.
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
            Plays well with others
          </h3>
          <p className="mt-3 text-lg text-neutral-400">
            No more screen capture chaos. Ping calls integrate seamlessly with
            your favorite streaming software.
          </p>
          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    ></path>
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Embed your feeds directly
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Every caller has a feed of their own - just drop a URL in a
                browser source and you&apos;re set.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    ></path>
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Maintain full control
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
  <div className="my-10 bg-neutral-950 px-24 py-10">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
      <div className="text-3xl">Become a kreator and claim you link now</div>
      <div>
        <ClaimLink variant="lg" />
      </div>
    </div>
  </div>
);
