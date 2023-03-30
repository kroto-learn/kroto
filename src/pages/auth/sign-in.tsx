import { IoLogoGoogle, IoLogoGithub, IoLogoFacebook } from "react-icons/io";
import { BsDiscord } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const options = [
  {
    id: "google",
    name: "Google",
    icon: <IoLogoGoogle />,
  },
  {
    id: "github",
    name: "GitHub",
    icon: <IoLogoGithub />,
  },
  {
    id: "discord",
    name: "Discord",
    icon: <BsDiscord />,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <IoLogoFacebook />,
  },
];

export default function SignIn() {
  const { query } = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md rounded-lg border border-neutral-700 bg-neutral-800 p-5">
        {query.error && (
          <p className="py-2 text-center text-sm font-medium text-red-400">
            Can't sign you in, issue with {query.error}
          </p>
        )}
        {!query.error && (
          <p className="text-center text-sm font-medium text-neutral-300">
            Sign in with
          </p>
        )}
        <div className="grid grid-cols-1 px-10 py-5">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => void signIn(o.id, { callbackUrl: "/" })}
              className="mb-2 mr-2 flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-16 py-2.5 text-lg font-medium text-neutral-300 transition hover:bg-neutral-700"
            >
              {o.icon} {o.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
