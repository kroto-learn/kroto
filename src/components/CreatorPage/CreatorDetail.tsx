import type { Creator } from "interfaces/Creator";
import Image from "next/image";
import React from "react";
import SocialLink from "../SocialLink";

type Props = {
  creator: Creator;
  collapsed: boolean;
};

const CreatorDetail = ({ creator, collapsed }: Props) => {
  return (
    <div
      className={`flex max-w-xl items-start justify-start gap-4 transition-all duration-300 ${
        collapsed ? "items-center gap-6" : "flex-col"
      }`}
    >
      <div
        className={`relative aspect-square overflow-hidden rounded-full transition-all duration-300 ${
          collapsed ? "w-36" : "w-64 border-8 border-neutral-900"
        }`}
      >
        <Image src={creator.image_url} alt={creator.name} fill />
      </div>
      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsed ? "gap-3" : "gap-6"
        }`}
      >
        <h1
          className={`font-medium text-white transition-all duration-300 ${
            collapsed ? "text-2xl" : "text-4xl"
          }`}
        >
          {creator.name}
        </h1>
        <p
          className={`text-white/80 transition-all duration-300 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {creator.bio}
        </p>
        <div className="flex max-w-sm flex-wrap items-center justify-start gap-3">
          {creator.links.map((link) => (
            <SocialLink
              collapsed={collapsed}
              key={link.href}
              href={link.href}
              type={link.type}
            >
              {link?.text}
            </SocialLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorDetail;
