import { DashboardLayout } from "..";
import Head from "next/head";
import QueriesLayout from "."
import Link from "next/link"
import AnimatedSection from "@/components/AnimatedSection";
import React, { type ReactNode } from "react"
import { usePathname } from "next/navigation";

const RepliedAnswer = () => {

  return (
    <>
      <Head>
        <title>Queries | Dashboard</title>
      </Head>
      <div>
        alskjdflksadjljsadlfjsldjflksdj
      </div>
    </>
  );
};

const nestLayout = (
    parent: (page: ReactNode) => JSX.Element,
    child: (page: ReactNode) => JSX.Element
  ) => {
    return (page: ReactNode) => parent(child(page));
  };
  
  export const RepliedNestedLayout = nestLayout(DashboardLayout, RepliedLayout);
  
  export default RepliedAnswer;
  
  RepliedAnswer.getLayout = RepliedNestedLayout;
  
  function RepliedLayoutR({ children }: { children: ReactNode }) {
    const pathname = usePathname();
  
    return (
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection
          delay={0.1}
          className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
        >
          <ul className="-mb-px flex flex-wrap">
            <li className="mr-2">
              <Link
                href="/creator/dashboard/queries"
                className={`inline-block rounded-t-lg p-4 ${
                  pathname === "/creator/dashboard/queries"
                    ? "border-b-2 border-pink-500 text-pink-500 transition"
                    : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                }`}
              >
                Not Replied
              </Link>
            </li>
            <li className="/creator/dashboard/queries">
              <Link
                href="/creator/dashboard/queries/replied"
                className={`inline-block rounded-t-lg p-4 transition ${
                  pathname === "/creator/dashboard/queries/replied"
                    ? "border-b-2 border-pink-500 text-pink-500"
                    : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                }`}
                aria-current="page"
              >
                Replied
              </Link>
            </li>
          </ul>
        </AnimatedSection>
        {children}
      </div>
    );
  }
  
  function RepliedLayout(page: ReactNode) {
    return <RepliedLayoutR>{page}</RepliedLayoutR>;
  }
  
  export { QueriesLayout };