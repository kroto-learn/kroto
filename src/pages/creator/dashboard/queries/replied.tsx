import QueriesLayout, { QueriesNestedLayout } from ".";
import React from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import Image from "next/image";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import MarkdownView from "@/components/MarkdownView";

const RepliedAnswer = () => {
  const { data: session } = useSession();

  const { data: creator } = api.creator.getProfile.useQuery();

  const { data: queries, isLoading } = api.askedQuery.getAllReplied.useQuery({
    creatorProfile: creator?.creatorProfile ?? "",
  });

  return (
    <>
      <Head>
        <title>Queries | Dashboard</title>
      </Head>
      <div className="flex w-full max-w-3xl flex-col items-center py-8">
        {queries && queries.length > 0 ? (
          <AnimatedSection delay={0.1} className="flex w-full flex-col gap-4">
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
                      <div className="w-full break-all pl-3">
                        <p>{query.user.name}</p>
                        <MarkdownView>{query.question ?? ""}</MarkdownView>
                      </div>
                    </div>
                    <div className="flex w-full text-ellipsis pt-2">
                      <div>
                        <Image
                          className="rounded-full dark:border-gray-800"
                          src={session?.user.image ?? ""}
                          width={30}
                          height={30}
                          alt={session?.user.name ?? ""}
                        />
                      </div>
                      <div className="w-full break-all pl-3">
                        <p>{session?.user.name ?? ""}</p>
                        <MarkdownView>{query.answer ?? ""}</MarkdownView>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              );
            })}
          </AnimatedSection>
        ) : isLoading ? (
          <Loader size="lg" />
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
              You have not reply any queries
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RepliedAnswer;

RepliedAnswer.getLayout = QueriesNestedLayout;

export { QueriesLayout };
