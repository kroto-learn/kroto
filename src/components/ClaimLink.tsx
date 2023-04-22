import Image from "next/image";
import logo from "public/kroto-logo.png";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export function ClaimLinkNew({ profile }: { profile?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  const makeCreator = api.creator.makeCreator.useMutation().mutateAsync;

  useEffect(() => {
    if (profile) setCreatorProfile(profile);
  }, [profile]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("creatorProfile", creatorProfile);
        if (session?.user) {
          const creator = await makeCreator({
            creatorProfile,
          });
          if (creator.isCreator)
            void router.push(`/creator/dashboard/settings`);
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
        className="w-full rounded-full border border-neutral-600 bg-neutral-700 p-2 px-4 pl-28 pr-32 text-xl outline-none duration-300 placeholder:text-neutral-500 focus:border-neutral-500"
      />
      <button
        type="submit"
        className="group absolute right-1 flex items-center gap-1 rounded-full bg-pink-600 p-2 px-4 text-xs font-bold text-neutral-200 duration-300 hover:bg-pink-700"
      >
        Claim Now
        <ChevronRightIcon className="w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

export default function ClaimLink({
  variant,
  profile,
}: {
  variant: "sm" | "lg" | "md";
  profile?: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  const makeCreator = api.creator.makeCreator.useMutation().mutateAsync;

  useEffect(() => {
    if (profile) setCreatorProfile(profile);
  }, [profile]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="group relative flex rounded-full border-neutral-700">
          <span
            className={`flex items-center ${
              variant === "sm" ? "pl-3" : "pl-5"
            }  rounded-l-full border border-r-0 border-neutral-800 bg-neutral-900/50 text-lg shadow backdrop-blur  transition duration-300 group-hover:border-neutral-700`}
          >
            <KrotoDotIn variant={variant} />
          </span>
          <input
            type="text"
            id="website-admin"
            value={creatorProfile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setCreatorProfile(e.target.value)
            }
            className={`block w-min rounded-none rounded-r-full border border-l-0 border-neutral-800 bg-neutral-900/50 fill-neutral-700  backdrop-blur transition duration-300 group-hover:border-neutral-700 ${
              variant === "sm" ? "p-2" : "p-4"
            } pl-1 ${
              variant === "lg"
                ? "text-3xl"
                : variant === "md"
                ? "text-lg"
                : "text-md"
            } placeholder-neutral-400 shadow outline-none ring-transparent active:outline-none active:ring-transparent`}
            placeholder="noobmaster69"
          />
          {creatorProfile && (
            <button
              onClick={async () => {
                localStorage.setItem("creatorProfile", creatorProfile);
                if (session?.user) {
                  const creator = await makeCreator({
                    creatorProfile,
                  });
                  if (creator.isCreator)
                    void router.push(`/creator/dashboard/settings`);
                } else {
                  void router.push(
                    `/auth/sign-in?creatorProfile=${creatorProfile}`
                  );
                }
              }}
              className={`absolute  cursor-pointer rounded-full ${
                variant === "md"
                  ? "right-8 translate-y-5  text-xl"
                  : variant === "sm"
                  ? "text-md right-5 translate-y-3"
                  : "right-8 translate-y-5 text-3xl "
              } transition-all duration-300 hover:translate-x-1`}
            >
              <ArrowRightIcon className="w-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function KrotoDotIn({ variant }: { variant: "sm" | "lg" | "md" }) {
  if (variant === "lg") {
    return (
      <div>
        <Link href="/">
          <div className="flex items-center">
            <div className="translate-y-[2px]">
              <Image src={logo} width={512 / 12} height={512 / 12} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 items-center text-4xl ">
              roto.in/
            </h2>
          </div>
        </Link>
      </div>
    );
  } else if (variant === "md") {
    return (
      <div>
        <Link href="/">
          <div className="flex items-center">
            <div className="translate-y-[2px]">
              <Image src={logo} width={512 / 15} height={512 / 15} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 items-center text-2xl ">
              roto.in/
            </h2>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/">
        <div className="flex items-center">
          <div>
            <Image src={logo} width={512 / 18} height={512 / 18} alt="logo" />
          </div>
          <h2 className="flex -translate-x-1 -translate-y-[1px] items-center text-xl">
            roto.in/
          </h2>
        </div>
      </Link>
    </div>
  );
}
