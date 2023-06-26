import { Loader } from "@/components/Loader";
import Image from "next/image";
import Layout from "@/components/layouts/main";
import { SenderImage, SenderName } from "@/components/CreatorDetails";
import { api } from "@/utils/api";
import Head from "next/head";
import ImageWF from "@/components/ImageWF";
import { useSession } from "next-auth/react";

const Index = () => {
  const { data: session } = useSession();

  const { data: queries, isLoading: queriesLoading } =
    api.askedQuery.getUserQuery.useQuery({ userId: session?.user.id ?? "" });

  if (queriesLoading)
    return (
      <>
        <Head>
          <title>Queries Given | Dashboard</title>
        </Head>
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  return (
    <Layout>
      <Head>
        <title>Queries</title>
      </Head>
      <div className="my-12 flex flex-col items-center p-6">
        <div className="flex min-h-screen w-full max-w-2xl flex-col items-start gap-4">
          <h1 className="text-3xl font-medium">Queries</h1>
          {queries && queries.length > 0 ? (
            <div className="flex w-full flex-col items-start gap-4">
              {queries.map((query) => (
                <div key={query?.id ?? ""} className="w-full">
                  <div className="w-full rounded-lg bg-neutral-800 px-4 py-2 text-gray-300">
                    <div className="flex">
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
                      {query.answer ? (
                        <div className="text-sm">Replied</div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {query.answer ? (
                      <div className="flex w-full truncate text-ellipsis pt-2">
                        <div>
                          <SenderImage query={query} />
                        </div>
                        <div className="pl-3">
                          <SenderName query={query} />
                          <p>{query.answer}</p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
              <div className="relative aspect-square w-40 object-contain">
                <ImageWF src="/empty/testimonial_empty.svg" alt="empty" fill />
              </div>
              <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
                You have not wrote any Queries.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
