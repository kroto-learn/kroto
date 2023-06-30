import { MixPannelClient } from "@/analytics/mixpanel";
import ImageWF from "@/components/ImageWF";
import ScrollAnimatedSection from "@/components/ScrollAnimatedSection";
import Layout from "@/components/layouts/main";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    MixPannelClient.getInstance().courseLandingViewed();
  }, []);

  return (
    <Layout>
      <Head>
        <title>100+ Super Courses | Kroto</title>
      </Head>
      {/* hero */}
      <div className="flex w-full flex-col items-center overflow-hidden py-8">
        <ScrollAnimatedSection className="relative mb-32 flex min-h-[80vh] w-full flex-col items-center justify-center gap-12 p-4">
          <h1 className="z-10 block max-w-4xl text-center text-4xl font-bold uppercase leading-normal md:text-6xl">
            {"⚡"}Super charge your learning with <br />
            <span
              className="linear-wipe text-5xl font-black
      shadow-neutral-200 drop-shadow-[3px_3px_0px_#fff] sm:whitespace-nowrap md:text-7xl"
            >
              100+{" "}
              <span className="">
                <span className="z-20">S</span>
                {/* <ImageWF
                className="absolute bottom-0 left-0"
                src="/cape.gif"
                alt=""
                width={300}
                height={300}
              /> */}
              </span>
              uper Courses
            </span>
          </h1>
          <div className="relative mt-4 sm:mt-12">
            <Link
              onClick={() => {
                MixPannelClient.getInstance().exploreCoursesClicked({
                  position: 1,
                });
              }}
              href="/courses"
              className="z-20 block rounded-full border-2 border-neutral-200 px-12 py-4 text-2xl font-bold text-neutral-200 shadow-[4px_4px_0px_0px] shadow-neutral-200 duration-300 hover:scale-95 hover:bg-pink-600 active:scale-90"
            >
              Explore Courses
            </Link>
            <ImageWF
              className="absolute -right-24 -top-24 hidden sm:block"
              src="/arrow.png"
              alt=""
              width={81}
              height={108}
            />
          </div>

          {/* <ImageWF
          className="absolute top-0 z-0"
          src="/thick-stroke.png"
          alt=""
          width={678}
          height={493}
        /> */}
          <ImageWF
            className="absolute bottom-0 left-0 rotate-90 sm:bottom-12 sm:left-32"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute left-0 top-12 rotate-180 hue-rotate-180 sm:left-48 sm:top-12"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute right-0 top-0 rotate-45 hue-rotate-60 sm:right-48 sm:top-12"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute bottom-0 right-0 -rotate-90 hue-rotate-[2260deg] sm:bottom-12 sm:right-12"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute bottom-12 right-48 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={112}
            height={53}
          />
          <ImageWF
            className="absolute left-12 top-48 rotate-180 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={152}
            height={73}
          />
        </ScrollAnimatedSection>

        <h1 className="my-4 block text-center text-3xl font-bold leading-normal sm:my-24 md:text-5xl">
          Why are these courses{" "}
          <span className="linear-wipe font-black">SUPER</span>?
        </h1>

        <ScrollAnimatedSection className="relative mx-auto my-8 flex min-h-[50vh] w-full max-w-6xl flex-col items-center gap-4 p-4 md:flex-row">
          <div className="relative h-80 w-[80%] object-contain sm:w-1/2">
            <ImageWF
              className="z-20  object-contain"
              src="/tracking.png"
              alt=""
              // width={438}
              // height={300}
              fill
            />
          </div>

          <h2 className="z-20 block w-full text-center text-2xl font-bold leading-normal sm:w-1/2 md:text-left md:text-4xl">
            <span className="whitespace-nowrap rounded-lg bg-pink-500/30 px-1">
              Track your progress
            </span>{" "}
            and monitor your learning at a glance with stunning
            <span className="ml-2 whitespace-nowrap rounded-lg bg-neutral-500/30 px-1">
              data visuals
            </span>
            .
          </h2>
          {/* <ImageWF
          className="absolute bottom-0 left-0 rotate-45 hue-rotate-[69deg]"
          src="/poly.png"
          alt=""
          width={80}
          height={89}
        /> */}
          <ImageWF
            className="absolute -left-12 bottom-0 rotate-90 hue-rotate-[143deg] backdrop-blur"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          {/* <ImageWF
          className="absolute bottom-12 right-48 rotate-45 hue-rotate-60"
          src="/poly.png"
          alt=""
          width={80}
          height={89}
        /> */}
          <ImageWF
            className="absolute right-12 top-12 -rotate-180 hue-rotate-[224deg]"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute bottom-12 right-48 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={112}
            height={53}
          />
          <ImageWF
            className="absolute left-12 top-48 rotate-180 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={152}
            height={73}
          />
        </ScrollAnimatedSection>

        <ScrollAnimatedSection className="relative mx-auto my-8 flex min-h-[50vh] w-full max-w-6xl flex-col-reverse items-center gap-4 p-4 md:flex-row">
          <h2 className="z-20 block w-full text-center text-2xl font-bold leading-normal sm:w-1/2 md:text-left md:text-4xl">
            Get instant doubt resolution with
            <span className="ml-2 rounded-lg bg-yellow-500/30 px-1 sm:whitespace-nowrap">
              FREE Doubt resolving sessions
            </span>{" "}
            with our experts.
          </h2>
          <div className="relative h-80 w-[80%] object-contain sm:w-1/2">
            <ImageWF
              className="z-20 object-contain"
              src="/dr-session.png"
              alt=""
              // width={365}
              // height={250}
              fill
            />
          </div>

          <ImageWF
            className="absolute -bottom-12 left-32 rotate-180"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />

          <ImageWF
            className="absolute bottom-12 right-48 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={112}
            height={53}
          />
          <ImageWF
            className="absolute left-12 top-48 rotate-180 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={152}
            height={73}
          />
        </ScrollAnimatedSection>

        <ScrollAnimatedSection className="relative mx-auto my-8 flex min-h-[50vh] w-full max-w-6xl flex-col items-center gap-4 p-4 md:flex-row">
          <div className="relative h-80  w-[80%] object-contain sm:w-1/2">
            <ImageWF
              className="z-20 object-contain"
              src="/email.png"
              alt=""
              // width={365}
              // height={250}
              fill
            />
          </div>
          <h2 className="z-20 block w-full text-center text-2xl font-bold leading-normal sm:w-1/2 md:text-left md:text-4xl">
            Stay focused and productive with our daily
            <span className="ml-2 whitespace-nowrap rounded-lg bg-purple-500/30 px-1">
              learning reports
            </span>{" "}
            and
            <span className="ml-2 whitespace-nowrap rounded-lg bg-indigo-500/30 px-1">
              reminders.
            </span>
          </h2>
          <ImageWF
            className="absolute -bottom-12 -left-32 rotate-90 hue-rotate-60"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          {/* <ImageWF
          className="absolute left-48 top-12 rotate-180 hue-rotate-180"
          src="/poly.png"
          alt=""
          width={80}
          height={89}
        /> */}

          <ImageWF
            className="absolute bottom-12 right-12 -rotate-90 hue-rotate-[260deg]"
            src="/poly.png"
            alt=""
            width={80}
            height={89}
          />
          <ImageWF
            className="absolute bottom-12 right-48 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={112}
            height={53}
          />
          <ImageWF
            className="absolute left-12 top-48 rotate-180 opacity-30"
            src="/thin-stroke.png"
            alt=""
            width={152}
            height={73}
          />
        </ScrollAnimatedSection>
        <Link
          onClick={() => {
            MixPannelClient.getInstance().exploreCoursesClicked({
              position: 1,
            });
          }}
          href="/courses"
          className="z-20 block rounded-full border-2 border-neutral-200 px-12 py-4 text-2xl font-bold text-neutral-200 shadow-[4px_4px_0px_0px] shadow-neutral-200 duration-300 hover:scale-95 hover:bg-pink-600 active:scale-90"
        >
          Explore Courses
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
