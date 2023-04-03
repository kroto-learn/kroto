import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { HiArrowSmRight } from "react-icons/hi";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kroto - Learn Collectively</title>
      </Head>
      <main>
        <button
          className="absolute right-5 top-5 z-10 text-neutral-300 hover:underline"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
        <PingHero />
      </main>
    </>
  );
};

export default Home;

export function PingHero() {
  const { data: session } = useSession();
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
                        onClick={() => {
                          session?.user
                            ? router.push("/dashboard")
                            : void signIn();
                        }}
                        className={`group inline-flex items-center gap-[0.15rem] rounded-xl bg-pink-600 px-6 py-2 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
                      >
                        {session?.user
                          ? "Go to dashboard"
                          : "Start you journey now"}
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
