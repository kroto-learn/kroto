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
          className={`text-center font-medium text-neutral-200 transition-all duration-300 lg:text-left ${
            collapsed ? "text-2xl" : "text-4xl"
          }`}
        >
          {creator.name}
        </h1>
        <p
          className={`text-center text-neutral-400 transition-all  duration-300 lg:text-left ${
            collapsed ? "" : ""
          }`}
        >
          {creator.bio}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
