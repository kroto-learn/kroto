import Image from "next/image";
import logo from "public/kroto-logo.png";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Loader } from "./Loader";

export function ClaimLink({ profile }: { profile?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  const { data: creator } = api.creator.getProfile.useQuery();
  const { mutateAsync: makeCreator, isLoading: makeCreatorLoading } =
    api.creator.makeCreator.useMutation();
  const ctx = api.useContext();

  useEffect(() => {
    if (profile) setCreatorProfile(profile);
  }, [profile]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("creatorProfile", creatorProfile);
        if (session?.user) {
          if (!creator?.isCreator) {
            const creatorM = await makeCreator(
              {
                creatorProfile,
              },
              {
                onSuccess: () => {
                  void ctx.creator.getProfile.invalidate();
                },
              }
            );
            if (creatorM.isCreator)
              void router.push(`/creator/dashboard/settings`);
          } else void router.push(`/creator/dashboard/settings`);
        } else {
          void router.push(`/auth/sign-in?creatorProfile=${creatorProfile}`);
        }
      }}
      className="relative flex max-w-sm items-center"
    >
      <div className="absolute left-4">
        <div className="relative">
          <Image src={logo} width={512 / 18} height={512 / 18} alt="logo" />
        </div>
      </div>
      <span className="absolute left-10 text-xl">roto.in/</span>
      <input
        value={creatorProfile}
        onChange={(e) => {
          setCreatorProfile(e.target.value);
        }}
        placeholder="yourname"
        className="w-full rounded-full border border-neutral-600 bg-neutral-700 p-2 px-4 pl-28 text-xl outline-none duration-300 placeholder:text-neutral-500 focus:border-neutral-500 md:pr-32"
      />
      <button
        type="submit"
        className="group absolute right-1 flex items-center gap-1 rounded-full bg-pink-600 p-2 px-4 text-xs font-bold text-neutral-200 duration-300 hover:bg-pink-700"
      >
        <span className="hidden md:block">Claim Now</span>
        {makeCreatorLoading ? (
          <Loader white />
        ) : (
          <ChevronRightIcon className="w-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}

export function ClaimLinkLanding({ profile }: { profile?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  const { mutateAsync: makeCreator, isLoading: makeCreatorLoading } =
    api.creator.makeCreator.useMutation();
  const { data: creator } = api.creator.getProfile.useQuery();
  const ctx = api.useContext();

  useEffect(() => {
    if (profile) setCreatorProfile(profile);
  }, [profile]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("creatorProfile", creatorProfile);
        if (session?.user) {
          if (!creator?.isCreator) {
            const creator = await makeCreator(
              {
                creatorProfile,
              },
              {
                onSuccess: () => {
                  void ctx.creator.getProfile.invalidate();
                },
              }
            );
            if (creator.isCreator)
              void router.push(`/creator/dashboard/settings`);
          } else void router.push(`/creator/dashboard/settings`);
        } else {
          void router.push(`/auth/sign-in?creatorProfile=${creatorProfile}`);
        }
      }}
      className="flex gap-3"
    >
      <div className="relative flex max-w-sm items-center md:max-w-md">
        <div className="absolute left-3 sm:left-5">
          <div className="relative aspect-square h-8">
            <Image src={logo} alt="logo" fill />
          </div>
        </div>
        <span className="absolute left-10 text-lg sm:left-12 md:text-2xl">
          roto.in/
        </span>
        <span
          className="absolute left-28 h-full sm:left-36"
          style={{
            width: "1px",
            backgroundPosition: "0 0, 0 0, 100% 0, 0 100%",
            backgroundSize: "2px 100%, 100% 2px, 2px 100% , 100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundImage:
              "repeating-linear-gradient(0deg, #ec4899, #ec4899 5px, transparent 5px, transparent 10px)",
          }}
        />
        <input
          value={creatorProfile}
          onChange={(e) => {
            setCreatorProfile(e.target.value);
          }}
          placeholder="yourname"
          className="w-full rounded-2xl border border-pink-500 bg-neutral-700/30 p-3 px-6 pl-32 text-lg shadow-[-2px_3px_0px_0px] shadow-pink-500 outline-none duration-300 placeholder:text-neutral-500 focus:shadow-[-4px_8px_0px_0px] focus:shadow-pink-500 sm:pl-40 md:text-2xl"
        />
      </div>
      <button
        type="submit"
        disabled={!creatorProfile || creatorProfile === ""}
        className="group flex h-[512/14px] items-center rounded-2xl border border-pink-500 bg-pink-500 px-6 py-2 font-bold text-neutral-200 shadow-[-2px_3px_0px_0px] shadow-pink-500/60 duration-300 hover:shadow-[-4px_7px_0px_0px] hover:shadow-pink-500/60 active:shadow-[-2px_3px_0px_0px] active:shadow-pink-500/60 disabled:cursor-not-allowed disabled:border-pink-500/80 disabled:bg-pink-500/50 disabled:text-neutral-200/70 disabled:hover:shadow-[-2px_3px_0px_0px] disabled:hover:shadow-pink-500/60"
      >
        <span className="hidden md:block">Claim Now</span>
        {makeCreatorLoading ? (
          <Loader white />
        ) : (
          <ChevronRightIcon className="w-6 transition-transform duration-300 group-hover:translate-x-1 group-disabled:group-hover:translate-x-0 sm:w-8" />
        )}
      </button>
    </form>
  );
}
