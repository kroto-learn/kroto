import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { type ReactNode, Fragment } from "react";
import { Loader } from "../Loader";
import AnimatedSection from "../AnimatedSection";

export default function CourseLayoutR({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id,
  });

  const pathname = usePathname();

  if (courseLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-8">
        <Loader size="lg" />
      </div>
    );

  if (!course) return <></>;

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <AnimatedSection className="flex w-full flex-col items-start justify-between gap-4 sm:px-4 md:flex-row">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="line-clamp-1 overflow-hidden text-ellipsis text-base text-neutral-200 sm:text-xl">
            {course?.title}
          </h1>

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
                            pathname === `/admin/dashboard/course/${id}`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/admin/dashboard/course/${id}`}
                        >
                          Overview
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full border-b border-neutral-600/50 px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/admin/dashboard/course/${id}/enrollments`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/admin/dashboard/course/${id}/enrollments`}
                        >
                          Enrollments
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full border-b border-neutral-600/50 px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/admin/dashboard/course/${id}/feedbacks`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/admin/dashboard/course/${id}/feedbacks`}
                        >
                          Feedbacks
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          className={`w-full px-6 py-2 font-medium active:text-pink-600 ${
                            pathname ===
                            `/admin/dashboard/course/${id}/settings`
                              ? "bg-pink-600/20 text-pink-600"
                              : "hover:text-pink-600"
                          }`}
                          href={`/admin/dashboard/course/${id}/settings`}
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
          href={`/course/${id}`}
          className="flex min-w-[8rem] items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <GlobeAltIcon className="w-4" />
          Public Page
        </Link>
      </AnimatedSection>
      <AnimatedSection className="hidden border-b border-neutral-700 text-center text-sm font-medium text-neutral-400 sm:block">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/admin/dashboard/course/${id}`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/admin/dashboard/course/${id}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/admin/dashboard/course/${id}/enrollments`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/admin/dashboard/course/${id}/enrollments`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Enrollments
            </Link>
          </li>
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/admin/dashboard/course/${id}/feedbacks`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/admin/dashboard/course/${id}/feedbacks`
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
              href={`/admin/dashboard/course/${id}/settings`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/admin/dashboard/course/${id}/settings`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Settings
            </Link>
          </li>
        </ul>
      </AnimatedSection>

      {children}
    </div>
  );
}
