import { h1Style, labelStyle, pStyle, pageStyle } from "@/styles/styles";
import { cva } from "class-variance-authority";

export const creatorPageStyle = cva([
  pageStyle(),
  "flex",
  "flex-col",
  "items-center",
]);

export const coverStyle = cva([
  "w-full",
  "aspect-[16/3]",
  "bg-cover",
  "bg-center",
]);

export const heroStyle = cva([
  "w-full",
  "flex",
  "items-center",
  "justify-between",
  "max-w-6xl",
  "gap-4",
  "-translate-y-44",
]);

export const creatorDetailsStyle = cva([
  "flex",
  "flex-col",
  "items-start",
  "justify-start",
  "gap-4",
  "max-w-xl",
]);

export const avatarStyle = cva([
  "w-64",
  "aspect-square",
  "rounded-full",
  "overflow-hidden",
  "relative",
  "border-8",
  "border-neutral-900",
]);

export const nameH1Style = cva([h1Style()]);

export const bioPStyle = cva([pStyle(), "text-white/80"]);

export const linksStyle = cva([
  "flex",
  "flex-wrap",
  "gap-3",
  "max-w-sm",
  "items-center",
  "justify-start",
]);

export const featuredStyle = cva([
  "rounded-md",
  "bg-white/20",
  "flex",
  "p-4",
  "flex-col",
  "gap-2",
]);

export const featureLabelStyle = cva([labelStyle()]);
