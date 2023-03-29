import { IoLogoGoogle, IoLogoGithub, IoLogoFacebook } from "react-icons/io";
import { BsDiscord } from "react-icons/bs";
import { signIn } from "next-auth/react";

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
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md rounded-lg border border-neutral-700 bg-neutral-800 p-5">
        <p className="text-center text-sm font-medium text-neutral-300">
          Sign in with
        </p>
        <div className="grid grid-cols-1 px-10 py-5">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => void signIn(o.id)}
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
