import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  GlobeAltIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { type ReactNode, Fragment } from "react";

export default function EventLayoutR({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event } = api.event.get.useQuery({ id });

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 px-4 md:flex-row">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="truncate text-xl text-neutral-200">{event?.title}</h1>

          <div className="flex flex-col items-end sm:hidden">
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button>
                    {open ? (
                      <ChevronDownIcon className="w-6" />
                    ) : (
                      <Bars3Icon className="w-6" />
                    )}
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
                    <Menu.Items className="fixed z-20 mt-8 flex flex-col overflow-hidden rounded-xl bg-neutral-900/80 backdrop-blur-sm">
                      <Menu.Item>
                        <Link
                          className={`w-full border-b border-neutral-600/50 px-6 py-2 font-medium  active:text-pink-600 ${
                            pathname === `/creator/dashboard/event/${id}`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/creator/dashboard/event/${id}`}
                        >
                          Overview
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full border-b border-neutral-600/50 px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/creator/dashboard/event/${id}/registrations`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/creator/dashboard/event/${id}/registrations`}
                        >
                          Registrations
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full border-b border-neutral-600/50 px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/creator/dashboard/event/${id}/feedbacks`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/creator/dashboard/event/${id}/feedbacks`}
                        >
                          Feedbacks
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/creator/dashboard/event/${id}/settings`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/creator/dashboard/event/${id}/settings`}
                        >
                          Settings
                        </Link>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
        <Link
          href={`/event/${id}`}
          className="flex min-w-[7rem] items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
        >
          <GlobeAltIcon className="w-4" /> Event Public Page
        </Link>
      </div>
      <div className="hidden border-b border-neutral-700 text-center text-sm font-medium text-neutral-400 sm:block">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/creator/dashboard/event/${id}`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/creator/dashboard/event/${id}/registrations`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}/registrations`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Registrations
            </Link>
          </li>
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/creator/dashboard/event/${id}/feedbacks`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}/feedbacks`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Feedbacks
            </Link>
          </li>
          <li>
            <Link
              href={`/creator/dashboard/event/${id}/settings`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}/settings`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {children}
    </div>
  );
}
