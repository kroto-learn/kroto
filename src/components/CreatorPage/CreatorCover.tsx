import React from "react";
import { cx } from "class-variance-authority";
import { coverStyle } from "./CreatorPage.style";

const CreatorCover = () => {
  {
    /* FIXME: Remove hardcoded bg-url for cover */
  }

  return (
    <div
      className={cx(
        coverStyle(),
        "bg-[url('https://res.cloudinary.com/dvisf70pm/image/upload/v1680098856/1664349376731_sdktvy.jpg')]"
      )}
    ></div>
  );
};

export default CreatorCover;
