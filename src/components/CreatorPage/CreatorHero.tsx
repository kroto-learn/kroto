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
    <div className="relative my-6 flex w-6/12 flex-col items-center">
      <div className="absolute z-[2]">
        <div
          className={`relative aspect-square w-28 overflow-hidden  rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
        >
          <Image src={creator.image_url} alt={creator.name} fill />
        </div>
      </div>
      <div
        className={`mt-[3.7rem] flex w-full items-center justify-between gap-4 rounded-xl bg-neutral-800 px-12 pb-12 pt-16 backdrop-blur-lg transition-all duration-300`}
      >
        <CreatorDetail creator={creator} collapsed={collapsed} />
        <Featured creator={creator} collapsed={collapsed} />
      </div>
    </div>
  );
};

export default CreatorHero;
