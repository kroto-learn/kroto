import { type GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import { ClaimLink, ClaimLinkLanding } from "@/components/ClaimLink";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import CalenderDaysIcon from "@heroicons/react/20/solid/CalendarDaysIcon";
import creatorPageImage from "public/creator-page.png";
import {
  CircleStackIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ListBulletIcon,
  NewspaperIcon,
} from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import landingOg from "public/landing/og.png";
import Footer from "@/components/Footer";
import { MixPannelTracking } from "@/analytics/mixpanel";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    MixPannelTracking.getInstance().pageViewed({
      pagePath: "/",
    });
  }, []);

  return (
    <>
      <Head>
        <title>Kroto - Learn Collectively</title>
        <meta
          name="description"
          content="Collective learning with the creators you love."
        />

        {/* Google SEO */}
        <meta itemProp="name" content="Kroto - Learn Collectively" />
        <meta
          itemProp="description"
          content="Collective learning with the creators you love."
        />
        <meta itemProp="image" content={landingOg.src} />
        {/* Facebook meta */}
        <meta property="og:title" content="Kroto - Learn Collectively" />
        <meta
          property="og:description"
          content="Collective learning with the creators you love."
        />
        <meta property="og:image" content={landingOg.src} />
        <meta property="image" content={landingOg.src} />
        <meta property="og:url" content="https://kroto.in" />
        <meta property="og:type" content="website" />
        {/* twitter meta */}
        <meta name="twitter:title" content="Kroto - Learn Collectively" />
        <meta
          name="twitter:description"
          content="Collective learning with the creators you love."
        />
        <meta name="twitter:image" content={landingOg.src} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <nav>
        <Navbar status={status} />
      </nav>

      <main className="mt-20">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="claim-link">
          <ClaimLinkBannerLanding />
        </div>
        <Footer />
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getServerAuthSession(ctx),
    },
  };
};

export default Home;

export function Hero() {
  return (
    <div className="my-28">
      <div className="mx-auto flex w-full flex-col gap-10 px-2 sm:px-6 md:max-w-7xl lg:px-8">
        <div className="flex h-full flex-col pt-10 sm:pt-16 lg:pt-0">
          <div className="mx-auto max-w-lg sm:max-w-4xl sm:px-4 sm:text-center lg:flex lg:items-center lg:pl-0 lg:text-left">
            <div className="">
              <h1 className="relative max-w-4xl text-center text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl">
                 {/* Create. Market. Monetize. */}
                <span className="block">Unlocking the potential of</span>
                <span className="block pb-3 text-pink-500 sm:pb-5">
                  Online Education
                </span>
              </h1>
              <p className="relative my-5 text-center text-base text-neutral-300 sm:text-xl lg:text-lg xl:text-2xl">
                We help online educators market and monetize their content and provide
                students with a seamless learning experience
              </p>
              <div className="mt-6 flex justify-center sm:mt-8">
                <div className="sm:mx-auto sm:max-w-xl lg:mx-0">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-center lg:justify-start">
                    <a
                      href="#claim-link"
                      // onClick={() => {
                      //   void (session?.user
                      //     ? router.push("/dashboard")
                      //     : void signIn());
                      // }}
                      className={`group inline-flex items-center gap-[0.15rem] rounded-xl bg-pink-600 px-6 py-2 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
                    >
                      {/* {status === "loading" && <Loader />}
                      {session?.user
                        ? "Go to dashboard"
                        : "Become a Kreator now"} */}
                      Become a Kreator now
                      <ArrowRightIcon className="w-5 text-xl duration-300 group-hover:translate-x-1" />
                    </a>
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
          {/* <div className=""> */}
          <Image
            src="/landing/hero_image.png"
            alt="crap"
            width={1500}
            height={1500}
            className="mt-10 min-h-fit object-cover sm:h-1/2 md:h-2/3 xl:h-2/3"
          />
          {/* </div> */}
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
                  <CalenderDaysIcon className="w-5" />
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
                  <ListBulletIcon className="w-5" />
                </div>
                <p className="ml-16 flex items-center gap-2 text-lg font-medium leading-6">
                  Create courses for a cohort of students{" "}
                  <span className="rounded-full border border-pink-600 bg-pink-500/50 p-1 px-2 text-xs text-pink-100">
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
        <div className="mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <Image
            src="/landing/courses.png"
            alt="courses"
            width={1000}
            height={1000}
          />
        </div>
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
                    <CircleStackIcon className="w-5" />
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
                    <CurrencyDollarIcon className="w-5" />
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
          >
            <Image
              src="/landing/audience.png"
              alt="audience"
              width={1000}
              height={1000}
            />
          </div>
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
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <NewspaperIcon className="w-5" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Newsletters to target your audience
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Optimising for conversion rate should be an important part of
                your marketing strategy. We help you build a database of your
                audience who are truely interested in your content.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-pink-500 text-white">
                  <EnvelopeIcon className="w-5" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6">
                  Send custom emails to the database we help you build
                </p>
              </dt>
              <dd className="ml-16 mt-2 text-base text-neutral-400">
                Deliver personalized emails based on their buying behavior,
                survey responses, chat interactions, and support tickets to
                promote loyalty and growth.
              </dd>
            </div>
          </dl>
        </div>
        <div className="relative mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <Image
            src="/landing/newsletter.png"
            alt="Newsletter"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
};

export const ClaimLinkBannerLanding = () => {
  const router = useRouter();
  const { creatorProfile } = router.query as {
    creatorProfile: string;
  };
  return (
    <div className="relative mt-10 overflow-hidden bg-gradient-to-t from-neutral-950 via-neutral-950 px-4 py-10 md:px-24">
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-10 text-center md:max-w-7xl lg:text-left">
        <div className="">
          <h2 className="text-center text-2xl font-extrabold leading-8 tracking-tight sm:text-3xl md:text-4xl">
            Become a{" "}
            <span className="cursor-none text-pink-500 transition duration-300 hover:text-pink-600">
              Kreator
            </span>{" "}
            now, and claim your kreator proflie
          </h2>
          <p className="tex-md mx-auto mt-4 max-w-3xl text-center text-neutral-400 md:text-xl">
            Monetize your audience, and provide them with value like never
            before.
          </p>

          {/* <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-40 translate-y-48 rounded-full bg-pink-600/20 blur-3xl"></div> */}
        </div>

        <ClaimLinkLanding profile={creatorProfile} />
      </div>
    </div>
  );
};
export const ClaimLinkBanner = () => {
  const router = useRouter();
  const { creatorProfile } = router.query as {
    creatorProfile: string;
  };

  return (
    <div className="relative mx-auto my-8 flex w-full max-w-3xl flex-col items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-l from-neutral-900 to-neutral-800 p-6 px-8 md:items-start md:p-10 md:px-12">
      <h3 className="text-center text-2xl font-medium md:text-left">
        Become a <span className="text-pink-600">Kreator</span> now, and claim
        your proflie
      </h3>
      <p className="text-center text-base text-neutral-300 md:max-w-[60%] md:text-left">
        Monetize your audience and provide them with value like never before.
      </p>
      <span className="mb-2" />

      <ClaimLink profile={creatorProfile} />
      <div className="absolute bottom-0 right-0 hidden xl:block">
        <div className="relative">
          <Image
            src={creatorPageImage}
            width={1024 / 5}
            height={1024 / 6}
            alt="creator-page"
          />
        </div>
      </div>
    </div>
  );
};
