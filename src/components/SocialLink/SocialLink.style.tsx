import { cva } from "class-variance-authority";

export const linkStyle = cva(
  [
    "px-3",
    "py-2",
    "font-medium",
    "text-white",
    "cursor-pointer",
    "flex",
    "gap-2",
    "items-center",
    "text-xs",
  ],
  {
    variants: {
      type: {
        youtube: [
          "text-red-500",
          "border",
          "border-red-500",
          "hover:bg-red-500",
          "hover:text-white",
          "duration-300",
        ],
        linkedin: [
          "text-sky-600",
          "border",
          "border-sky-600",
          "hover:bg-sky-600",
          "hover:text-white",
          "duration-300",
        ],
        instagram: [
          "text-pink-600",
          "border",
          "border-pink-600",
          "hover:bg-pink-600",
          "hover:text-white",
          "duration-300",
        ],
        twitter: [
          "text-blue-500",
          "border",
          "border-blue-500",
          "hover:bg-blue-500",
          "hover:text-white",
          "duration-300",
        ],
        website: [
          "text-gray-300",
          "border",
          "border-gray-300",
          "hover:bg-gray-300",
          "hover:text-black",
          "duration-300",
        ],
        other: [
          "text-gray-200",
          "border",
          "border-gray-200",
          "hover:bg-gray-200",
          "hover:text-black",
          "duration-300",
        ],
      },
    },
    defaultVariants: {
      type: "other",
    },
  }
);
