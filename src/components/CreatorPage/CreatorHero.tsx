import React from "react";
import type { Creator } from "interfaces/Creator";
import CreatorDetail from "./CreatorDetail";
import Featured from "./Featured";

type Props = {
  creator: Creator;
  collapsed: boolean;
};

const CreatorHero = ({ creator, collapsed }: Props) => {
  return (
    <div
      className={`fixed z-[2] flex w-full  items-center justify-between gap-4 transition-all duration-300 ${
        collapsed
          ? "my-6 max-w-[85rem] rounded-xl bg-[#1F1F20] px-16 py-8 backdrop-blur-lg"
          : "my-40 max-w-7xl"
      }`}
    >
      <CreatorDetail creator={creator} collapsed={collapsed} />
      <Featured creator={creator} collapsed={collapsed} />
    </div>
  );
};

export default CreatorHero;
