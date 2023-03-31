import type { Creator } from "interfaces/Creator";
import React from "react";
import SocialLink from "../SocialLink";

type Props = {
  creator: Creator;
  collapsed: boolean;
};

const CreatorDetail = ({ creator, collapsed }: Props) => {
  return (
    <div
      className={`flex w-full max-w-xl items-start justify-start gap-4 transition-all duration-300 ${
        collapsed ? "items-center gap-6" : "flex-col"
      }`}
    >
      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsed ? "gap-4" : "gap-6"
        }`}
      >
        <h1
          className={`font-medium text-neutral-200 transition-all duration-300 ${
            collapsed ? "text-2xl" : "text-4xl"
          }`}
        >
          {creator.name}
        </h1>
        <p
          className={`text-neutral-400 transition-all duration-300 ${
            collapsed ? "" : ""
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
