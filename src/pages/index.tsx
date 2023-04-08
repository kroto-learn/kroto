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
                  <span className="block">Collective learning with the </span>
                  <span className="block pb-3 text-pink-500 sm:pb-5">
                    creators you love
                  </span>
                </h1>
                <p className="relative my-5 text-center text-base text-neutral-300 sm:text-xl lg:text-lg xl:text-2xl">
                  Learn directly and in public with the creator through
                  cohort-based courses, live events or courses with amazing
                  learning experience.
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
