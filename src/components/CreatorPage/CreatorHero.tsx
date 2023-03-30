import React from "react";
import SocialLink from "../SocialLink/SocialLink";
import {
  heroStyle,
  creatorDetailsStyle,
  avatarStyle,
  nameH1Style,
  bioPStyle,
  linksStyle,
  featuredStyle,
  featureLabelStyle,
} from "./CreatorPage.style";
import Image from "next/image";
import type { Creator } from "interfaces/Creator";

type Props = {
  creator: Creator;
};

const CreatorHero = ({ creator }: Props) => {
  return (
    <div className={heroStyle()}>
      <div className={creatorDetailsStyle()}>
        <div className={avatarStyle()}>
          <Image src={creator.image_url} alt={creator.name} fill />
        </div>
        <h1 className={nameH1Style()}>{creator.name}</h1>
        <p className={bioPStyle()}>{creator.bio}</p>
        <div className={linksStyle()}>
          {creator.links.map((link) => (
            <SocialLink key={link.href} href={link.href} type={link.type}>
              {link?.text}
            </SocialLink>
          ))}
        </div>
      </div>
      <div className={featuredStyle()}>
        <p className={featureLabelStyle()}>FEATURED</p>
        <div className=""></div>
      </div>
    </div>
  );
};

export default CreatorHero;
