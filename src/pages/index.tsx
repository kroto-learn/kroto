import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import Image from "next/image";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <>
      <Head>
        <title>Kroto - Learn Collectively</title>
      </Head>
      <main className="bg-neutral-900 ">
        <button
          className="absolute right-5 top-5 z-10 text-white"
          onClick={() => void signOut()}
        >
          Sing out
        </button>
        <PingHero />
      </main>
    </>
  );
};

export default Home;

export function PingHero() {
  return (
    <div className="relative overflow-hidden">
      <SVGBackground />
      <div className="mx-auto flex h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="pt-10 sm:pt-16 lg:pb-14 lg:pt-0">
          <div className="">
            <div className="mx-auto max-w-lg sm:max-w-4xl sm:px-4 sm:text-center lg:flex lg:items-center lg:pl-0 lg:text-left">
              <div className="">
                <h1 className="relative max-w-4xl text-center font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl">
                  <span className="block">Collective learning with the </span>
                  <span className="block pb-3 text-pink-500 sm:pb-5">
                    creators you love
                  </span>
                </h1>
                <p className="relative my-5 text-center text-base text-gray-300 sm:text-xl lg:text-lg xl:text-2xl">
                  Learn directly and in public with the creator through
                  cohort-based courses, live events or courses with amazing
                  learning experience.
                </p>
                <div className="mt-6 flex justify-center sm:mt-8">
                  <div className="sm:mx-auto sm:max-w-xl lg:mx-0">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-center lg:justify-start">
                      <button
                        onClick={() => void signIn()}
                        className="relative inline-flex items-center rounded-md border border-pink-700 bg-pink-600 px-6 py-3 text-lg font-medium text-white shadow-sm hover:border-pink-800 hover:bg-pink-700"
                      >
                        <span className="flex items-center gap-1">
                          Start your journey now <MdArrowRightAlt />
                        </span>
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

export function Hero() {
  return (
    <body className="flex h-screen items-center justify-center overflow-hidden">
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-7xl px-12">
          <div className="mx-auto w-full text-left md:w-11/12 md:text-center xl:w-9/12">
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
              <span>Start</span>{" "}
              <span className="leading-12 block w-full bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text py-2 text-transparent lg:inline">
                learnive collectively
              </span>{" "}
              <span>with the creators you love</span>
            </h1>
            <p className="mb-8 px-0 text-lg text-gray-600 md:text-xl lg:px-24">
              Start gaining the traction you've always wanted with our
              next-level templates and designs. Crafted to help you tell your
              story.
            </p>
            <div className="mb-4 space-x-0 md:mb-8 md:space-x-2">
              <button
                onClick={() => void signIn()}
                className="mb-2 inline-flex w-full items-center justify-center rounded-2xl bg-green-400 px-6 py-3 text-lg text-white sm:mb-0 sm:w-auto"
              >
                Get Started
                <svg
                  className="ml-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="mx-auto mt-20 w-full text-center md:w-10/12">
            <div className="relative z-0 mt-8 w-full">
              <div className="relative overflow-hidden shadow-2xl">
                <div className="flex h-11 flex-none items-center rounded-xl rounded-b-none bg-green-400 px-4">
                  <div className="flex space-x-1.5">
                    <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                    <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                    <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <img src="https://cdn.devdojo.com/images/march2021/green-dashboard.jpg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </body>
  );
}

export function TeacherHeader() {
  return (
    <div className="relative overflow-hidden">
      <SVGBackground />
      <div className="relative pb-32 pt-16 sm:pb-48">
        <main className="max-w-8xl mx-auto mt-16 px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl md:text-8xl">
              <span>Learn collectively</span> with the{" "}
              <span>creators you love</span>
            </h1>
            <p className="mx-auto mt-5 max-w-6xl text-base text-gray-700 sm:text-lg md:mt-8 md:max-w-6xl md:text-4xl">
              Saves over 90% of teachers&apos; time in creating, sharing,
              grading and managing assignments
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={() => void signIn()}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-orange-700 md:px-10 md:py-4 md:text-lg"
                >
                  Get started now
                </button>
              </div>
            </div>
          </div>
        </main>
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
