import type { ReactElement, ReactNode } from "react";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiFillYoutube,
  AiOutlineLink,
  AiOutlineTwitter,
} from "react-icons/ai";
import { VscGlobe } from "react-icons/vsc";

type Props = {
  href: string;
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
  children?: ReactNode;
  collapsed?: boolean;
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
  collapsed,
}: {
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
  children: ReactNode;
  collapsed?: boolean;
}) => ReactElement = ({ type, children, collapsed }) => {
  if (collapsed) return <></>;
  else
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

const SocialLink = ({ href, type = "other", children, collapsed }: Props) => {
  return (
    <a
      className={`flex cursor-pointer items-center gap-2 border border-gray-200/20 bg-white/10 px-3 py-2 font-medium text-gray-200 duration-300 hover:bg-gray-200 hover:text-black ${
        collapsed ? "aspect-square rounded-full text-base" : "text-xs"
      }`}
      href={href}
      target="_blank"
    >
      <>
        <Icon type={type} />
        <Text type={type} collapsed={collapsed}>
          {children}
        </Text>
      </>
    </a>
  );
};

export default SocialLink;
