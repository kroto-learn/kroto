"use client";

import { getCreators } from "mock/getCreators";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { BsArrowRight, BsUpload } from "react-icons/bs";
import { FaSave } from "react-icons/fa";

export default function Page() {
  const { data: session } = useSession();
  const creatorProfile = localStorage.getItem("creatorProfile") ?? "";

  return (
    <div className="mx-20 my-10 flex h-screen flex-col items-center justify-center">
      <div className="relative mb-10">
        <div
          className={`relative mx-auto mb-5 aspect-square w-28  overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
        >
          <Image
            src={session?.user?.image ?? ""}
            alt={session?.user.name ?? ""}
            fill
          />
        </div>

        <div className="absolute bottom-4 right-2 z-10 cursor-pointer rounded-full bg-neutral-800 p-2 text-base transition-all duration-300 hover:bg-neutral-700">
          <BsUpload />
        </div>
      </div>
      <div>
        <div className="flex justify-center gap-5">
          <div>
            <label className="mb-2 block font-medium text-neutral-400">
              Name
            </label>
            <div className="relative mb-6">
              <input
                value={session?.user?.name ?? ""}
                type="text"
                id="input-group-1"
                className="block min-w-[20rem] rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                placeholder="Your Name, not your mom's"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block font-medium text-neutral-400">
              Kreator Profile
            </label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-600 bg-neutral-700 px-3 font-medium text-neutral-400">
                kroto.in/@
              </span>
              <input
                value={creatorProfile}
                type="text"
                id="website-admin"
                className="block min-w-[14rem] rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                placeholder="enter a cute username"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block font-medium text-neutral-400">Bio</label>
          <div className="relative mb-6">
            <textarea
              id="input-group-2"
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              placeholder="I am this, and this and this"
            />
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className={`group my-5 inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
          >
            <FaSave /> Save Changes
          </button>
          <button
            className={`group my-5 inline-flex items-center gap-1 rounded-xl px-6 py-2 text-center font-medium text-pink-600 underline underline-offset-4 transition-all duration-300 hover:text-pink-700 `}
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}