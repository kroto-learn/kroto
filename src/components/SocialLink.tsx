import type { ReactElement, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { GlobeAltIcon, LinkIcon } from "@heroicons/react/24/outline";
type Props = {
  href: string;
  type: string;
  children?: ReactNode;
  collapsed?: boolean;
};

const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case "youtube":
      return <FontAwesomeIcon className="text-sm" icon={faYoutube} />;
    case "twitter":
      return <FontAwesomeIcon className="text-sm" icon={faTwitter} />;
    case "linkedin":
      return <FontAwesomeIcon icon={faLinkedinIn} />;
    case "instagram":
      return <FontAwesomeIcon icon={faInstagram} />;
    case "website":
      return <GlobeAltIcon className="w-4" />;
    default:
      return <LinkIcon className="w-4" />;
  }
};

const Text: ({
  type,
  children,
  collapsed,
}: {
  type: string;
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
      className={`flex h-10 w-10 cursor-pointer items-center justify-center gap-2 border border-neutral-600 bg-neutral-200/10 px-2 py-1 font-medium text-neutral-200 duration-300 hover:bg-neutral-200 hover:text-black ${
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
