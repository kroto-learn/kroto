import Image from "next/image";
import logo from "public/kroto-logo.png";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function ClaimLink() {
  const router = useRouter();
  const { data: session } = useSession();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  const makeCreator = api.creator.makeCreator.useMutation().mutateAsync;

  return (
    <form
      onSubmit={async () => {
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
        className="group absolute right-1 flex items-center gap-1 rounded-full bg-pink-600 p-2 px-4 text-xs font-bold text-neutral-200 duration-300 hover:bg-pink-600/20 hover:text-pink-600"
      >
        Claim Now
        <ChevronRightIcon className="w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
