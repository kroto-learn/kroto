import { cva } from "class-variance-authority";

const pageStyle = cva([
  "w-screen",
  "overflow-x-hidden",
  "min-h-screen",
  "bg-[url('/pattern.svg')]",
  "bg-neutral-900",
]);

export const h1Style = cva(["text-white", "text-4xl", "font-medium"]);

export const pStyle = cva(["text-white"]);

export const labelStyle = cva([
  "text-gray-300",
  "text-sm",
  "uppercase",
  "font-medium",
]);

export { pageStyle };
