import { KrotoLogo } from "@/pages/auth/sign-in";
import { Menu } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="fixed top-0 z-40 w-full border-b border-neutral-900/50 bg-neutral-950/50 font-medium backdrop-blur-lg">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-5 px-5 py-2">
          <div className="flex items-center gap-5">
            <KrotoLogo />
            {router.asPath === "/" && (
              <div className="hidden gap-5 md:flex">
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
            )}
          </div>
          {session ? (
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
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="transition-all hover:text-neutral-400"
              onClick={() => void signIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
