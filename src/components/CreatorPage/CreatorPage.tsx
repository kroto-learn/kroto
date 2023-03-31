import type { Creator } from "interfaces/Creator";
import React, { useEffect, useState } from "react";
import CreatorHero from "./CreatorHero";
import CreatorCover from "./CreatorCover";
import Events from "./Events";

type Props = { creator: Creator };

const CreatorPage = ({ creator }: Props) => {
  const [scrollLength, setScrollLength] = useState<number>(0);

  useEffect(() => {
    function handleScroll() {
      const newScrollLength = window.scrollY;
      setScrollLength(newScrollLength);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="flex h-full min-h-screen w-screen flex-col items-center overflow-x-hidden bg-neutral-900 bg-[url('/pattern.svg')] pb-24">
      <CreatorCover />
      <CreatorHero creator={creator} collapsed={scrollLength > 200} />
      {/* <Courses courses={creator.courses} /> */}
      <Events events={creator.events} />
    </main>
  );
};

export default CreatorPage;
