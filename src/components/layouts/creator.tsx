import Link from "next/link";
import ImageWF from "../ImageWF";
import { Menu, Transition } from "@headlessui/react";
import { type User } from "@prisma/client";
import { Fragment, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { isAdmin } from "@/server/helpers/admin";
import { signIn, signOut, useSession } from "next-auth/react";
import { MixPannelClient } from "@/analytics/mixpanel";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function CreatorLayout({
  children,
  creator,
}: {
  children: React.ReactNode;
  creator: User;
}) {
  const session = useSession();

  const router = useRouter();

  const { data: user, isLoading: userLoading } =
    api.creator.getProfile.useQuery();

  useEffect(() => {
    console.log("router", router.asPath);
  }, [router]);

  return (
    <div>
      <nav>
        <div className="fixed top-0 z-40 w-full border-b border-neutral-800/50 bg-neutral-950/50 font-medium backdrop-blur-lg">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between gap-5 px-5 py-2">
              <div className="flex items-center gap-5">
                <Link
                  href={`/${creator?.creatorProfile ?? ""}`}
                  className="group mx-4 flex items-center gap-2"
                >
                  <ImageWF
                    src={creator?.image ?? ""}
                    alt={creator?.name}
                    width={38}
                    height={38}
                    className="rounded-full"
                  />
                  <p className="font-medium text-neutral-200 duration-150 group-hover:text-neutral-100">
                    {creator?.name}
                  </p>
                </Link>
              </div>
              <div className="flex items-center gap-8">
                {session.status === "authenticated" && !userLoading ? (
                  <Menu as="div" className="relative inline-block text-left">
                    {({ open }) => (
                      <div className="flex flex-col items-end">
                        <Menu.Button>
                          <div className="relative flex items-center rounded-full bg-neutral-800 px-4 py-1">
                            <h6 className="text-sm font-bold">
                              {session?.data?.user?.name?.split(" ")[0]}
                            </h6>
                            <ChevronDownIcon
                              className={`duration-150 ${
                                open ? "rotate-180" : ""
                              } w-5`}
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
                            {user?.isCreator ? (
                              <Menu.Item>
                                <Link
                                  href="/creator/dashboard/courses"
                                  className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                                >
                                  Studio
                                </Link>
                              </Menu.Item>
                            ) : (
                              <></>
                            )}
                            <Menu.Item>
                              <Link
                                href="/dashboard"
                                className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                              >
                                Dashboard
                              </Link>
                            </Menu.Item>
                            {isAdmin(session?.data?.user?.email ?? "") ? (
                              <Menu.Item>
                                <Link
                                  href="/admin/dashboard/courses"
                                  className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                                >
                                  Admin
                                </Link>
                              </Menu.Item>
                            ) : (
                              <></>
                            )}
                            <Menu.Item>
                              <Link
                                className={`w-full px-6 py-2 font-medium transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                                onClick={() => {
                                  MixPannelClient.getInstance().signOut({
                                    email: session?.data?.user?.email ?? "",
                                    name: session?.data?.user?.name ?? "",
                                    id: session?.data?.user?.id ?? "",
                                  });
                                  void signOut({ callbackUrl: router.asPath });
                                }}
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
                ) : !(session.status === "loading") &&
                  session.status === "unauthenticated" ? (
                  <button
                    className="font-bold transition-all duration-300 hover:text-neutral-400"
                    onClick={() =>
                      void signIn(undefined, { callbackUrl: router.asPath })
                    }
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="relative flex animate-pulse items-center rounded-full bg-neutral-800 px-4 py-1">
                    <h6 className="text-sm font-bold text-neutral-800">
                      loading
                    </h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="mt-14">{children}</main>
    </div>
  );
}
