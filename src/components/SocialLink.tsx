import type { ReactElement, ReactNode } from "react";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiFillYoutube,
  AiOutlineLink,
  AiOutlineTwitter,
} from "react-icons/ai";
import { VscGlobe } from "react-icons/vsc";
import { cva, cx } from "class-variance-authority";

const linkStyle = cva([], {
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
});

type Props = {
  href: string;
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
  children?: ReactNode;
};

const Icon = ({
  type,
}: {
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
}) => {
  switch (type) {
    case "youtube":
      return <AiFillYoutube />;
    case "twitter":
      return <AiOutlineTwitter />;
    case "linkedin":
      return <AiFillLinkedin />;
    case "instagram":
      return <AiFillInstagram />;
    case "website":
      return <VscGlobe />;
    default:
      return <AiOutlineLink />;
  }
};

const Text: ({
  type,
  children,
}: {
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
  children: ReactNode;
}) => ReactElement = ({ type, children }) => {
  switch (type) {
    case "youtube":
      return (<>YouTube</>) as ReactElement;
    case "twitter":
      return (<>Twitter</>) as ReactElement;
    case "linkedin":
      return (<>Linkedin</>) as ReactElement;
    case "instagram":
      return (<>Instagram</>) as ReactElement;
    case "website":
      return (<>Website</>) as ReactElement;
    default:
      return children as ReactElement;
  }
};

const SocialLink = ({ href, type = "other", children }: Props) => {
  return (
    <a
      className={cx(
        "flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-medium",
        linkStyle({ type })
      )}
      href={href}
      target="_blank"
    >
      <>
        <Icon type={type} />
        <Text type={type}>{children}</Text>
      </>
    </a>
  );
};

export default SocialLink;
