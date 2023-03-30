import type { ReactElement, ReactNode } from "react";
import { linkStyle } from "./SocialLink.style";
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
    <a className={linkStyle({ type })} href={href} target="_blank">
      <>
        <Icon type={type} />
        <Text type={type}>{children}</Text>
      </>
    </a>
  );
};

export default SocialLink;
