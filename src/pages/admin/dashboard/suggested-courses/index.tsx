import Head from "next/head";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/utils/api";

import { AdminDashboardLayout } from "..";
import ImageWF from "@/components/ImageWF";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const Index = () => {
  const { data: suggestions, isLoading: suggestionsLoading } =
    api.suggestionsCourse.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Suggested Courses | Admin</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection className="flex w-full items-center justify-between gap-4 sm:px-4">
          <h1 className="text-2xl text-neutral-200">Suggested Courses</h1>
        </AnimatedSection>
        {suggestionsLoading ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : suggestions && suggestions.length > 0 ? (
          <AnimatedSection
            delay={0.2}
            className="flex max-h-[85vh] w-full flex-col items-start gap-4 overflow-y-auto sm:p-4"
          >
            {suggestions?.map((sg) => (
              <div key={sg.id} className="flex items-start gap-4">
                <div
                  className={`relative aspect-video w-40 overflow-hidden rounded-lg`}
                >
                  <ImageWF
                    src={sg?.playlist?.thumbnail ?? ""}
                    alt={sg?.playlist?.title ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h4 className="line-clamp-1 overflow-hidden text-ellipsis text-sm">
                    {sg?.playlist?.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs">
                    <p>suggested by</p>
                    <ImageWF
                      src={sg?.user?.image ?? ""}
                      alt=""
                      height={20}
                      width={20}
                      className="ml-2 aspect-square rounded-full object-cover"
                    />
                    <p>{sg?.user?.name}</p>
                  </div>
                  <Link
                    href={`/course/admin-import?ptId=${sg?.playlistId}`}
                    className="flex items-center rounded-lg border border-pink-500 px-3 py-1 text-xs font-bold text-pink-500 hover:border-pink-600 hover:text-pink-600"
                  >
                    Open in Import
                    <ArrowUpRightIcon className="w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection
            delay={0.2}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 text-center"
          >
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not created any category yet.
            </p>
          </AnimatedSection>
        )}
      </div>
    </>
  );
};

export default Index;

Index.getLayout = AdminDashboardLayout;
