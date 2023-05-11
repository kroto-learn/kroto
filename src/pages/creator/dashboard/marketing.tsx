/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import React from "react";
import { Loader } from "@/components/Loader";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

const Marketing = () => {
  const router = useRouter();
  const { audience } = router.query as { audience?: string };
  const isImportedTab = audience === "imported";
  const { data: audienceData, isLoading: isAudienceLoading } =
    api.creator.audience.getAudienceMembers.useQuery();

  const { data: importedAudienceData, isLoading: isImpAudLoading } =
    api.creator.audience.getImportedAudience.useQuery();

  const isLoading = isImportedTab ? isImpAudLoading : isAudienceLoading;

  if (isLoading)
    return (
      <>
        <Head>
          <title>Audience | Dashboard</title>
        </Head>
        <div className="my-12 flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Audience | Dashboard</title>
      </Head>
      <div className="mx-2 my-8 min-h-[80%] w-full px-6">
        <div className="mb-6 flex w-full items-start justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl text-neutral-200">
              {audienceData?.length ??
                0 + (importedAudienceData?.length ?? 0) ??
                "-"}
            </p>
            <h3 className="mb-4 text-xl font-medium">Audience members</h3>
          </div>
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              disabled={audienceData?.length === 0 || !audienceData}
              type="button"
              className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            >
              <PlusCircleIcon className="h-4" /> Create Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketing;

Marketing.getLayout = DashboardLayout;
