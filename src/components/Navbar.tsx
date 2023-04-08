import { KrotoLogo } from "@/pages/auth/sign-in";
import { Menu } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-neutral-950 ">
      <div className="mx-auto max-w-7xl bg-neutral-950">
        <div className="flex items-center justify-between gap-5 p-5">
          <div className="flex items-center  gap-5">
            <KrotoLogo />
            <Link
              className="transition-all hover:text-neutral-400"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="transition-all hover:text-neutral-400"
              href="/discover"
            >
              Discover
            </Link>
            <Link
              className="transition-all hover:text-neutral-400"
              href="#claim-link"
            >
              Claim Link
            </Link>
          </div>
          <div className="flex gap-5">
            <Link
              className="transition-all hover:text-neutral-400"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <button
              className="transition-all hover:text-neutral-400"
              onClick={() => void signOut()}
            >
              Signout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
