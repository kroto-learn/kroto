import type { Creator } from "interfaces/Creator";
import Image from "next/image";
import React from "react";
import SocialLink from "../SocialLink";

type Props = {
  creator: Creator;
};

const CreatorDetail = ({ creator }: Props) => {
  return (
    <div className="flex max-w-xl flex-col items-start justify-start gap-4">
      <div className="relative aspect-square w-64 overflow-hidden rounded-full border-8 border-neutral-900">
        <Image src={creator.image_url} alt={creator.name} fill />
      </div>
      <h1 className="text-4xl font-medium text-white">{creator.name}</h1>
      <p className="text-white/80">{creator.bio}</p>
      <div className="flex max-w-sm flex-wrap items-center justify-start gap-3">
        {creator.links.map((link) => (
          <SocialLink key={link.href} href={link.href} type={link.type}>
            {link?.text}
          </SocialLink>
        ))}
      </div>
    </div>
  );
};

export default CreatorDetail;
