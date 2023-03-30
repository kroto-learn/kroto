import React from "react";
import type { Creator } from "interfaces/Creator";
import CreatorDetail from "./CreatorDetail";
import Featured from "./Featured";

type Props = {
  creator: Creator;
};

const CreatorHero = ({ creator }: Props) => {
  return (
    <div className="flex w-full max-w-7xl -translate-y-44 items-center justify-between gap-4">
      <CreatorDetail creator={creator} />
      <Featured creator={creator} />
    </div>
  );
};

export default CreatorHero;
