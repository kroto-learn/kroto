import type { Creator } from "interfaces/Creator";
import React from "react";
import CreatorHero from "./CreatorHero";
import CreatorCover from "./CreatorCover";
import Courses from "./Courses";
import Events from "./Events";

type Props = { creator: Creator };

const CreatorPage = ({ creator }: Props) => {
  return (
    <main className="flex h-full min-h-screen w-screen flex-col items-center overflow-x-hidden bg-neutral-900 bg-[url('/pattern.svg')]">
      <CreatorCover />
      <CreatorHero creator={creator} />
      <Courses courses={creator.courses} />
      <Events events={creator.events} />
    </main>
  );
};

export default CreatorPage;
