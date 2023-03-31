import React from "react";
import type { Creator } from "interfaces/Creator";
import CreatorDetail from "./CreatorDetail";
import Featured from "./Featured";
import Image from "next/image";

type Props = {
  creator: Creator;
  collapsed: boolean;
};

const CreatorHero = ({ creator, collapsed }: Props) => {
  return (
    <div className="relative my-6 flex w-full max-w-4xl flex-col items-center p-4 lg:items-start">
      <div className="absolute z-[2] lg:left-32">
        <div
          className={`relative aspect-square w-28 overflow-hidden  rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
        >
          <Image src={creator.image_url} alt={creator.name} fill />
        </div>
      </div>
      <div
        className={`mt-[3.7rem] flex w-full flex-col items-center justify-between gap-4 rounded-xl bg-neutral-800 px-8 pb-8 pt-16 backdrop-blur-lg transition-all duration-300 lg:flex-row lg:px-12 lg:pb-12 lg:pt-16`}
      >
        <CreatorDetail creator={creator} collapsed={collapsed} />
        <Featured creator={creator} collapsed={collapsed} />
      </div>
    </div>
  );
};

export default CreatorHero;
