import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { HiArrowSmRight } from "react-icons/hi";
import { useRouter } from "next/router";
import Layout from "@/components/layouts/main";

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
      <main>
        <button
          className="absolute right-5 top-5 z-10 text-neutral-300 hover:underline"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
        <PingHero />
        <Ping />
      </main>
    </Layout>
  );
};

export default Home;

export function PingHero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* <SVGBackground /> */}
      <div className="mx-auto flex h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="pt-10 sm:pt-16 lg:pb-14 lg:pt-0">
          <div className="">
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
                        {session?.user ? "Go to dashboard" : "Become a Creator"}
                        <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*   <div className="col-span-3 "> */}
            {/*     <Image */}
            {/*       height={1080} */}
            {/*       width={1920} */}
            {/*       alt="product-image" */}
            {/*       className="translate-x-52 w-full h-full scale-[1.75] shadow-lg shadow-black" */}
            {/*       src="https://framerusercontent.com/images/Gd3Yit2xrNnwGKoCYY6fCPEfeaA.svg" */}
            {/*     /> */}
            {/*   </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export const SVGBackground = () => (
  <div className="relative mx-auto h-full max-w-7xl">
    <svg
      className="absolute right-full translate-x-1/4 translate-y-1/4 transform lg:translate-x-1/2"
      width={404}
      height={784}
      fill="none"
      viewBox="0 0 404 784"
    >
      <defs>
        <pattern
          id="f210dbf6-a58d-4871-961e-36d5016a0f49"
          x={0}
          y={0}
          width={20}
          height={20}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x={0}
            y={0}
            width={4}
            height={4}
            className="text-neutral-800"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect
        width={404}
        height={784}
        fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
      />
    </svg>
    <svg
      className="absolute left-full -translate-x-1/4 -translate-y-3/4 transform md:-translate-y-1/2 lg:-translate-x-1/2"
      width={404}
      height={784}
      fill="none"
      viewBox="0 0 404 784"
    >
      <defs>
        <pattern
          id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
          x={0}
          y={0}
          width={20}
          height={20}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x={0}
            y={0}
            width={4}
            height={4}
            className="text-neutral-800"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect
        width={404}
        height={784}
        fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
      />
    </svg>
  </div>
);

export const Ping = () => {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <h2 className="text-center text-3xl font-extrabold leading-8 tracking-tight sm:text-4xl">
          Video calls built for professional creators
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-400">
          Content creation is hard. Creating with your friends is even harder.
          We built Ping to make bringing on guests as easy as copy-pasting into
          OBS.
        </p>
      </div>
      <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Keeps you looking your best
            <span className="text-gray-400">for LSF</span>
          </h3>
          <p className="mt-3 text-lg text-gray-400">
            We're built for high-end cameras and mics, not 7 year old phones and
            earbuds. You'll see the difference instantly.
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
              <dd className="ml-16 mt-2 text-base text-gray-400">
                HD isn't optional for our creators. We support up to 1080p at
                60fps for every caller (if you have the bandwidth for it).
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
              <dd className="ml-16 mt-2 text-base text-gray-400">
                When we say live, we mean it. Latency in Ping is often under ⅓
                of the competition. No more awkward pauses or cutoffs, Ping
                feels more like IRL than anything else.
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <div className="flex flex-col gap-4 lg:gap-8">
            <div className="w-2/3 flex-1 self-start rounded-lg bg-gray-950 pb-1 shadow-lg">
              <div className="relative rounded-lg border-4 border-gray-950">
                <div className="safari-video-overflow-fix relative aspect-video overflow-hidden rounded"></div>
                <div className="absolute z-10 hidden rounded-full shadow-lg lg:block">
                  <div className="h-full w-full rounded-full ring-2 ring-black/20">
                    <div className="safari-video-overflow-fix relative h-full w-full overflow-hidden rounded-full">
                      <div className="absolute aspect-video"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-2 top-2 drop-shadow-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 260 150"
                    fill="currentColor"
                    className="h-10"
                  >
                    <path d="M231.53,25.79A16.71,16.71,0,0,1,248.24,42.5v65a16.71,16.71,0,0,1-16.71,16.71H134.64a15.5,15.5,0,0,1-31,0H28.47A16.71,16.71,0,0,1,11.76,107.5v-65A16.71,16.71,0,0,1,28.47,25.79H231.53m0-9.76H28.47A26.49,26.49,0,0,0,2,42.5v65A26.49,26.49,0,0,0,28.47,134H96a25.25,25.25,0,0,0,46.33,0h89.23A26.49,26.49,0,0,0,258,107.5v-65A26.49,26.49,0,0,0,231.53,16ZM102.8,98.32a8.84,8.84,0,0,1-17.68,0V68.67a8.84,8.84,0,1,1,17.68,0Zm64.92-1.53a10.38,10.38,0,0,1-10.41,10.33h-.92a10.36,10.36,0,0,1-8.35-4.21l-.11-.16L128,73.93v50a8.84,8.84,0,0,1-17.68,0V52.52a10.39,10.39,0,0,1,10.34-10.41h1a10.6,10.6,0,0,1,8.44,4.37l.18.24L150,75.3v-7a8.84,8.84,0,1,1,17.68,0Zm63.81-3.68a10.49,10.49,0,0,1-5.9,9.55,44.41,44.41,0,0,1-19.93,4.84c-19,0-32.27-13.49-32.27-32.81,0-19.1,13.48-33,32-33A38.68,38.68,0,0,1,227.34,48a8.6,8.6,0,0,1,4.12,7.34,8.44,8.44,0,0,1-8.57,8.49,8.89,8.89,0,0,1-4-1l-.33-.18a22.67,22.67,0,0,0-12.31-3.55c-9.48,0-15.14,5.8-15.14,15.52s6,15.53,15.52,15.53a22.73,22.73,0,0,0,8.08-1.45V83.64h-7.31a8.49,8.49,0,1,1,0-17H222.5a8.93,8.93,0,0,1,9,9ZM74.62,49.56C70,44.87,63.34,42.5,54.76,42.5H37.27a8.84,8.84,0,0,0-8.8,8.87V98.32a8.84,8.84,0,0,0,17.67,0V87.25h8.62c8.58,0,15.26-2.38,19.87-7.07a21.62,21.62,0,0,0,6-15.31A21.6,21.6,0,0,0,74.62,49.56ZM53.85,71.8H46.14V58h7.71c8.6,0,8.6,4.68,8.6,6.92S62.45,71.8,53.85,71.8Z"></path>
                  </svg>
                </div>
                <div className="absolute bottom-1 left-1">
                  <div className="flex space-x-2 rounded-md bg-black/95 px-3 py-2 text-xs font-medium text-gray-300">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="twitch"
                      className="svg-inline--fa fa-twitch relative top-0.5 -ml-0.5 mr-1.5"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M391.2 103.5H352.5v109.7h38.63zM285 103H246.4V212.8H285zM120.8 0 24.31 91.42V420.6H140.1V512l96.53-91.42h77.25L487.7 256V0zM449.1 237.8l-77.22 73.12H294.6l-67.6 64v-64H140.1V36.58H449.1z"
                      ></path>
                    </svg>
                    CoolPingUser
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/3 flex-1 self-end rounded-lg bg-gray-950 pb-1 shadow-lg">
              <div className="relative rounded-lg border-4 border-gray-950">
                <div className="safari-video-overflow-fix relative aspect-video overflow-hidden rounded"></div>
                <div className="absolute z-10 hidden rounded-full shadow-lg lg:block">
                  <div className="h-full w-full rounded-full ring-2 ring-black/20">
                    <div className="safari-video-overflow-fix relative h-full w-full overflow-hidden rounded-full">
                      <div className="absolute aspect-video"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-2 top-2 drop-shadow-xl">
                  <span className="text-lg font-bold">Not Ping™</span>
                </div>
                <div className="absolute bottom-0 left-0">
                  <div className="flex space-x-2 bg-black/80 px-2 py-1 text-xs text-gray-300">
                    Some normie
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-12 sm:mt-16 lg:mt-24">
        <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="lg:col-start-2">
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Easier than cheating
              <span className="text-gray-400">in TF2</span>
            </h3>
            <p className="mt-3 text-lg text-gray-400">
              Getting your guests onto your show is as easy as sending them a
              link. No more leaked join codes - you can see who's joining by
              their Twitch username.
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
                <dd className="ml-16 mt-2 text-base text-gray-400">
                  We don't screw around with your safety on stream. All users
                  are authenticated with Twitch, Twitter or Youtube, so you know
                  the person joining is the person you invited.
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
                <dd className="ml-16 mt-2 text-base text-gray-400">
                  Our default layouts are built around creation, not call
                  participation. That means no more frames moving around when
                  you don't want them to.
                </dd>
              </div>
            </dl>
          </div>
          <div
            className="relative mt-10 px-4 lg:col-start-1 lg:mt-0 lg:pl-0 lg:pr-8"
            aria-hidden="true"
          >
            <div className="relative">
              <div className="absolute -top-4 right-0 z-10 w-11/12 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg sm:-right-12 sm:w-2/3 lg:-top-8 lg:right-0">
                <div className="flex divide-x divide-gray-700">
                  <div className="flex w-0 flex-1 items-center p-4">
                    <div className="w-full text-xs sm:text-sm">
                      <p className="flex flex-wrap items-center gap-2 font-medium">
                        <span className="truncate font-bold">FreckleBytes</span>
                        <span className="bg-gray-750 whitespace-nowrap rounded-sm px-1 py-0.5 text-xs capitalize text-gray-400">
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="twitch"
                            className="svg-inline--fa fa-twitch"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="currentColor"
                              d="M391.2 103.5H352.5v109.7h38.63zM285 103H246.4V212.8H285zM120.8 0 24.31 91.42V420.6H140.1V512l96.53-91.42h77.25L487.7 256V0zM449.1 237.8l-77.22 73.12H294.6l-67.6 64v-64H140.1V36.58H449.1z"
                            ></path>
                          </svg>
                          Twitch
                        </span>
                      </p>
                      <p className="mt-1 text-gray-200">
                        Would like to join the room.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col divide-y divide-gray-700">
                      <div className="flex h-0 flex-1 flex-col">
                        <button
                          className="hover:bg-gray-750 relative inline-flex items-center !rounded-none rounded border border-transparent px-4 py-2 text-sm font-medium !text-pink-500 text-white hover:!text-pink-400 hover:text-gray-100 sm:!rounded-tr-lg"
                          type="button"
                          aria-disabled="false"
                        >
                          <span className="">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="circle-check"
                              className="svg-inline--fa fa-circle-check fa-fw -ml-0.5 mr-1.5"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
                              ></path>
                            </svg>
                            Allow
                          </span>
                        </button>
                      </div>
                      <div className="flex h-0 flex-1 flex-col">
                        <button
                          className="hover:bg-gray-750 relative inline-flex items-center !rounded-none rounded border border-transparent px-4 py-2 text-sm font-medium !text-gray-400 text-white hover:!text-gray-300 hover:text-gray-100 sm:!rounded-br-lg"
                          type="button"
                          aria-disabled="false"
                        >
                          <span className="">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="do-not-enter"
                              className="svg-inline--fa fa-do-not-enter fa-fw -ml-0.5 mr-1.5"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM96 208C87.16 208 80 215.2 80 224V288C80 296.8 87.16 304 96 304H416C424.8 304 432 296.8 432 288V224C432 215.2 424.8 208 416 208H96z"
                              ></path>
                            </svg>
                            Deny
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="animate-fade-in absolute top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 text-sm">
                  That's not very nice 😞
                  <button
                    className="relative inline-flex items-center rounded border border-transparent px-2.5 py-1.5 text-xs font-medium text-white hover:text-gray-300"
                    type="button"
                  >
                    <span className="">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="rotate-left"
                        className="svg-inline--fa fa-rotate-left mr-1"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M30.81 49.81c8.969-3.656 19.28-1.656 26.16 5.219l41.1 41.1c41.07-40.38 97.11-64.92 157.1-64.92C379.6 32.11 480 132.5 480 256s-100.4 223.9-223.9 223.9c-52.31 0-103.3-18.33-143.5-51.77c-10.19-8.5-11.56-23.62-3.062-33.81c8.531-10.22 23.62-11.56 33.81-3.062C174.9 417.5 214.9 432 256 432c97.03 0 176-78.97 176-176S353 80 256 80c-47.08 0-90.93 19.29-123.2 50.89l52.14 52.14c6.875 6.875 8.906 17.19 5.219 26.16C186.5 218.2 177.7 224 168 224h-128C26.75 224 16 213.3 16 200v-128C16 62.28 21.84 53.53 30.81 49.81z"
                        ></path>
                      </svg>
                      Undo
                    </span>
                  </button>
                </div>
                <div className="animate-fade-in absolute top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 text-sm">
                  You did it! 🎉 ezpz.
                </div>
              </div>
              <div className="grid-rows-call grid w-11/12 gap-4 rounded-lg bg-gray-950 p-4 shadow-lg sm:w-full lg:w-5/6">
                <div className="flex max-h-full flex-wrap justify-center gap-4">
                  <div className="animate-fade-in relative aspect-video w-[calc(50%-0.5rem)] rounded bg-gray-900">
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        className="inline-flex aspect-square h-12 w-12 overflow-hidden rounded-full bg-gray-600"
                        src="/_next/static/media/derp.f0a71572.png"
                        alt="User Avatar"
                      />
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <div className="flex space-x-1 rounded-md bg-black/95 px-1.5 py-1 text-xs font-medium text-gray-300">
                        Theo
                      </div>
                    </div>
                  </div>
                  <div className="animate-fade-in relative aspect-video w-[calc(50%-0.5rem)] rounded bg-gray-900">
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        className="inline-flex aspect-square h-12 w-12 overflow-hidden rounded-full bg-gray-600"
                        src="/_next/static/media/gasp.474d1a13.png"
                        alt="User Avatar"
                      />
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <div className="flex space-x-1 rounded-md bg-black/95 px-1.5 py-1 text-xs font-medium text-gray-300">
                        Melaise
                      </div>
                    </div>
                  </div>
                  <div className="animate-fade-in relative aspect-video w-[calc(50%-0.5rem)] rounded bg-gray-900">
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        className="inline-flex aspect-square h-12 w-12 overflow-hidden rounded-full bg-gray-600"
                        src="/_next/static/media/lol.11e2c929.png"
                        alt="User Avatar"
                      />
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <div className="flex space-x-1 rounded-md bg-black/95 px-1.5 py-1 text-xs font-medium text-gray-300">
                        Soundwave
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex divide-x divide-gray-700 rounded border border-gray-700 bg-gray-800 text-xs">
                    <div className="px-2 py-1.5">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="microphone"
                        className="svg-inline--fa fa-microphone fa-fw"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                      >
                        <path
                          fill="currentColor"
                          d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z"
                        ></path>
                      </svg>
                    </div>
                    <div className="px-2 py-1.5">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="video"
                        className="svg-inline--fa fa-video fa-fw"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M384 112v288c0 26.51-21.49 48-48 48h-288c-26.51 0-48-21.49-48-48v-288c0-26.51 21.49-48 48-48h288C362.5 64 384 85.49 384 112zM576 127.5v256.9c0 25.5-29.17 40.39-50.39 25.79L416 334.7V177.3l109.6-75.56C546.9 87.13 576 102.1 576 127.5z"
                        ></path>
                      </svg>
                    </div>
                    <div className="px-2 py-1.5">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="phone-slash"
                        className="svg-inline--fa fa-phone-slash fa-fw"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M271.1 367.5L227.9 313.7c-8.688-10.78-23.69-14.51-36.47-8.974l-108.5 46.51c-13.91 6-21.49 21.19-18.11 35.79l23.25 100.8C91.32 502 103.8 512 118.5 512c107.4 0 206.1-37.46 284.2-99.65l-88.75-69.56C300.6 351.9 286.6 360.3 271.1 367.5zM630.8 469.1l-159.6-125.1c65.03-78.97 104.7-179.5 104.7-289.5c0-14.66-9.969-27.2-24.22-30.45L451 .8125c-14.69-3.406-29.73 4.213-35.82 18.12l-46.52 108.5c-5.438 12.78-1.771 27.67 8.979 36.45l53.82 44.08C419.2 232.1 403.9 256.2 386.2 277.4L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189c-8.188 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Plays well with others
            <span className="text-gray-400">
              even
              <span className="relative inline-flex overflow-y-hidden">
                <span
                  className="select-none text-transparent"
                  aria-hidden="true"
                >
                  Windows
                </span>
                <span className="rotating-word_rotate-words-4__lQRQO absolute left-0 top-0">
                  <span className="block">OBS</span>
                  <span className="block">XSplit</span>
                  <span className="block">Windows</span>
                  <span className="block">OBS</span>
                </span>
              </span>
            </span>
          </h3>
          <p className="mt-3 text-lg text-gray-400">
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
              <dd className="ml-16 mt-2 text-base text-gray-400">
                Every caller has a feed of their own - just drop a URL in a
                browser source and you're set.
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
              <dd className="ml-16 mt-2 text-base text-gray-400">
                Want separate layers for every caller? We got you. How about the
                entire call with nameplates visible? Done. VTubers with a green
                screened background? Just add your usual chroma key filters.
              </dd>
            </div>
          </dl>
        </div>
        <div className="relative mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <div className="flex items-center gap-4 lg:flex-col">
            <div className="border-gray-750 flex w-96 flex-col overflow-hidden rounded-lg border shadow-lg">
              <div className="flex flex-col bg-gray-800">
                <div className="flex justify-between px-1 pt-1">
                  <div className="bg-gray-850 flex min-w-[6rem] items-center rounded-t px-2 py-1.5 text-xs text-gray-400">
                    <div className="bg-gray-750 h-1 w-2/5 rounded-full"></div>
                  </div>
                  <div className="mb-1 flex items-center space-x-2 px-2">
                    <div className="h-1.5 w-1.5 border-b border-gray-600"></div>
                    <div className="h-1.5 w-1.5 border border-gray-600"></div>
                    <div className="relative h-1.5 w-1.5">
                      <div className="absolute left-1/2 top-1/2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-gray-600"></div>
                      <div className="absolute left-1/2 top-1/2 w-2 -translate-x-1/2 -translate-y-1/2 -rotate-45 border-t border-gray-600"></div>
                    </div>
                  </div>
                </div>
                <div className="border-gray-750 bg-gray-850 flex items-center space-x-1 border-b p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-2 w-2 text-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-2 w-2 text-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-2 w-2 text-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  <div className="flex flex-1 gap-0.5 rounded-sm bg-gray-800 p-1 text-xs text-gray-400">
                    <div className="h-1 w-1/6 rounded-full bg-gray-700"></div>
                    <div className="bg-gray-750 h-1 w-1/12 rounded-full"></div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-2 w-2 text-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid-rows-call grid bg-gray-950 p-2">
                  <div className="safari-video-overflow-fix animate-fade-in relative aspect-video overflow-hidden rounded bg-gray-900">
                    <div className="relative h-full w-full"></div>
                    <div className="absolute bottom-1 left-1">
                      <div className="flex space-x-1 rounded-sm bg-black/95 px-1.5 py-1 text-xs font-medium text-gray-300">
                        FreckleBytes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-5 w-5">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fad"
                data-icon="angles-right"
                className="svg-inline--fa fa-angles-right fa-lg hidden animate-pulse text-pink-600 sm:block lg:rotate-90"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <g className="fa-duotone-group">
                  <path
                    className="fa-secondary"
                    fill="currentColor"
                    d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"
                  ></path>
                  <path
                    className="fa-primary"
                    fill="currentColor"
                    d="M256 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L370.8 256l-137.4-137.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C272.4 444.9 264.2 448 256 448z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="border-gray-750 flex w-96 flex-col overflow-hidden rounded-lg border shadow-lg">
              <div className="flex flex-col bg-gray-800">
                <div className="flex justify-between px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 674.4 739.86"
                      className="h-2.5 w-2.5 fill-current text-gray-600"
                    >
                      <path d="M656.36,433.63c-2.71-5-5.65-9.79-8.75-14.51s-6.26-9.05-9.66-13.36q-4.58-5.83-9.57-11.27T618,383.92c-3.38-3.18-6.86-6.27-10.46-9.2s-7.07-5.58-10.73-8.21-7.2-4.95-10.91-7.25q-5.94-3.66-12.1-6.91t-12.56-6c-4.18-1.84-8.42-3.52-12.71-5.07s-8.52-2.89-12.84-4.11-8.87-2.35-13.36-3.29-9.19-1.76-13.83-2.4-9.37-1.1-14.08-1.42q-7.33-.47-14.67-.42A199.43,199.43,0,0,0,294.57,599.26q3,8,6.73,15.73c1.22,2.56,2.51,5.1,3.84,7.6a8.54,8.54,0,0,1,1.05,1.95c.08.44-.51,1.09-.77,1.51l-2.06,3.19a246.14,246.14,0,0,1-59.73,63.07A243.72,243.72,0,0,1,135,737.2a247.39,247.39,0,0,1-66.41.8A242.75,242.75,0,0,1,0,719c4.85,1.54,9.76,2.91,14.71,4.07a202.74,202.74,0,0,0,23.2,4,199.8,199.8,0,0,0,124.15-26.49,202.08,202.08,0,0,0,49.78-41.78A198.76,198.76,0,0,0,258,557a201.28,201.28,0,0,0-.64-60.17A199.57,199.57,0,0,0,79.2,330.46q-7.12-.66-14.27-.82c-2.58-.05-5.16-.07-7.73,0-.5,0-.58.07-.9-.29a4.43,4.43,0,0,1-.47-.92l-.78-1.53c-.56-1.13-1.12-2.26-1.67-3.39C-4.07,203.92,44.34,60.36,162.47,0q-4.2,2.7-8.24,5.61c-5.23,3.77-10.3,7.76-15.14,12s-9.31,8.57-13.67,13.17S117,40.12,113.15,45.07q-5.33,6.81-10,14.06c-3.41,5.24-6.6,10.64-9.49,16.19C90.89,80.59,88.35,86,86.08,91.44q-3.3,7.92-5.87,16.07-2.64,8.38-4.54,17c-1.23,5.57-2.23,11.21-3,16.87s-1.24,11.52-1.53,17.31a199,199,0,0,0,49.9,141.13A202.75,202.75,0,0,0,166,337.57q2.61,1.59,5.25,3.12c95.43,54.79,217.2,21.85,272-73.58,2.85.13,5.69.31,8.54.53a243,243,0,0,1,96,28.31A244.93,244.93,0,0,1,674.4,479.37a206.49,206.49,0,0,0-8-24.37A201,201,0,0,0,656.36,433.63Z"></path>
                    </svg>
                    <div className="text-xxs font-semibold leading-[10px] text-gray-500"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 border-b border-gray-600"></div>
                    <div className="h-1.5 w-1.5 border border-gray-600"></div>
                    <div className="relative h-1.5 w-1.5">
                      <div className="absolute left-1/2 top-1/2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-gray-600"></div>
                      <div className="absolute left-1/2 top-1/2 w-2 -translate-x-1/2 -translate-y-1/2 -rotate-45 border-t border-gray-600"></div>
                    </div>
                  </div>
                </div>
                <div className="border-gray-750 flex items-center space-x-1 border-y px-1 py-0.5">
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-8 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-12 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 items-center justify-center bg-gray-700 p-2">
                  <div className="relative aspect-video w-11/12 rounded-sm bg-gray-950 sm:w-3/5">
                    <div className="absolute left-[15%] top-[5%] aspect-video w-[80%] border border-red-800">
                      <div className="relative h-full w-full overflow-hidden"></div>
                      <div className="absolute -left-0.5 -top-0.5 h-1 w-1 bg-red-800"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 h-1 w-1 bg-red-800"></div>
                      <div className="absolute -right-0.5 -top-0.5 h-1 w-1 bg-red-800"></div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-1 w-1 bg-red-800"></div>
                    </div>
                  </div>
                </div>
                <div className="border-gray-750 hidden grid-cols-5 gap-1 border-t bg-gray-800 p-1 sm:grid">
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-750 rounded-sm p-1">
                      <div className="h-1 w-3/5 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="bg-gray-850 flex flex-col gap-0.5 rounded-sm p-1">
                      <div className="h-1 w-6 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-8 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-7 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-5 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-7 rounded-full bg-gray-700"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-750 rounded-sm p-1">
                      <div className="h-1 w-2/5 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="bg-gray-850 flex flex-col gap-0.5 rounded-sm p-1">
                      <div className="h-1 w-7 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-6 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-7 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-5 rounded-full bg-gray-700"></div>
                      <div className="h-1 w-8 rounded-full bg-gray-700"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-750 rounded-sm p-1">
                      <div className="h-1 w-3/5 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="bg-gray-850 flex flex-1 flex-col gap-0.5 rounded-sm p-1">
                      <div className="bg-gray-750 h-3 rounded-sm"></div>
                      <div className="bg-gray-750 h-3 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-750 rounded-sm p-1">
                      <div className="h-1 w-2/5 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="h-2 w-3/4 rounded-sm bg-gray-700"></div>
                      <div className="bg-gray-750 h-2 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-750 rounded-sm p-1">
                      <div className="h-1 w-3/5 rounded-full bg-gray-600"></div>
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="h-2 rounded-sm bg-gray-700"></div>
                      <div className="h-2 rounded-sm bg-gray-700"></div>
                      <div className="h-2 rounded-sm bg-gray-700"></div>
                      <div className="h-2 rounded-sm bg-gray-700"></div>
                    </div>
                  </div>
                </div>
                <div className="border-gray-750 flex items-center justify-end space-x-1 border-t bg-gray-800 px-1 py-0.5">
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-12 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-8 rounded-sm"></div>
                  <div className="bg-gray-750 h-1.5 w-4 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Loader = () => (
  <div role="status">
    <svg
      aria-hidden="true"
      className="mr-2 h-5 w-5 animate-spin fill-pink-400 text-pink-50"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);
