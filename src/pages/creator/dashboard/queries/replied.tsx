import { DashboardLayout } from "..";
import QueriesLayout from ".";
import React, { type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import AnimatedSection from "@/components/AnimatedSection";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const RepliedAnswer = () => {
  const { data: session } = useSession();

  const { data: creator } = api.askedQuery.getAllCreatorProtected.useQuery({
    id: session?.user.id ?? "",
  });

  const { data: queries } = api.askedQuery.getAllCreator.useQuery({
    creatorProfile: creator?.creatorProfile ?? "",
  });

  return (
    <>
      <Head>
        <title>Queries | Dashboard</title>
      </Head>
      <div className="flex w-full flex-col items-center py-8">
        {queries && queries.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
            {queries.map((query) => {
              return query.answer ? (
                <div key={query?.id ?? ""}>
                  <div className="w-full rounded-lg bg-neutral-800 px-4 py-2 text-gray-300">
                    <div className="flex w-full">
                      <div>
                        <Image
                          className="rounded-full dark:border-gray-800"
                          src={query.user.image ?? ""}
                          width={30}
                          height={30}
                          alt={query?.user.name ?? ""}
                        />
                      </div>
                      <div className="w-full pl-3">
                        <p>{query.user.name}</p>
                        <p className="">{query.question}</p>
                      </div>
                    </div>
                    <div className="flex w-full truncate text-ellipsis pt-2">
                      <div>
                        <Image
                          className="rounded-full dark:border-gray-800"
                          src={session?.user.image ?? ""}
                          width={30}
                          height={30}
                          alt={session?.user.name ?? ""}
                        />
                      </div>
                      <div className="pl-3">
                        <p>{session?.user.name ?? ""}</p>
                        <p>{query.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
            <div className="aspect-square object-contain">
              <FontAwesomeIcon
                icon={faCommentDots}
                fontSize={200}
                className="text-neutral-700"
              />
            </div>
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not wrote any Queries.
            </p>
          </div>
        )}
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
