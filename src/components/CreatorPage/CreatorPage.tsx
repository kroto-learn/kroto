import type { Creator } from "interfaces/Creator";
import React from "react";
import { creatorPageStyle } from "./CreatorPage.style";
import CreatorHero from "./CreatorHero";
import CreatorCover from "./CreatorCover";

type Props = { creator: Creator };

const CreatorPage = ({ creator }: Props) => {
  return (
    <main className={creatorPageStyle()}>
      <CreatorCover />
      <CreatorHero creator={creator} />
    </main>
  );
};

export default CreatorPage;
