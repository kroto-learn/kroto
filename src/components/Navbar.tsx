import { KrotoLogo } from "@/pages/auth/sign-in";
import { Menu, Transition } from "@headlessui/react";
import { api } from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";

export default function Navbar() {
  const { status } = useSession();
  const { data: creator, isLoading } = api.creator.getProfile.useQuery();

  return (
    <div className="fixed top-0 z-40 w-full border-b border-neutral-800/50 bg-neutral-950/50 font-medium backdrop-blur-lg">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-5 px-5 py-2">
          <div className="flex items-center gap-5">
            <KrotoLogo />
          </div>
          {status === "authenticated" && !isLoading ? (
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <div className="flex flex-col items-end">
                  <Menu.Button>
                    <div className="relative h-9 w-9 rounded-full">
                      <Image
                        src={creator?.image ?? ""}
                        alt="Profile Image"
                        className={`rounded-full transition-all ${
                          open ? "ring ring-neutral-700" : ""
                        }`}
                        fill
                      />
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 top-12 mt-2 flex origin-top-right flex-col divide-y divide-neutral-800 overflow-hidden rounded-xl bg-neutral-900/80 backdrop-blur-sm duration-300">
                      <Menu.Item>
                        <Link
                          href={
                            creator?.isCreator
                              ? "/creator/dashboard/events"
                              : "/dashboard"
                          }
                          className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                        >
                          Dashboard
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                          onClick={() => void signOut({ callbackUrl: "/" })}
                          href="/"
                        >
                          Sign Out
                        </Link>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </div>
              )}
            </Menu>
          ) : (
            <>
              {!(status === "loading") && status === "unauthenticated" ? (
                <button
                  className="transition-all duration-300 hover:text-neutral-400"
                  onClick={() => void signIn()}
                >
                  Sign In
                </button>
              ) : (
                <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-800" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
