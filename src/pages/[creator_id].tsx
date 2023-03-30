import CreatorPage from "@/components/CreatorPage/CreatorPage";
import type { Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import type { GetStaticPropsContext } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "querystring";
import React from "react";

type CreatorPageProps = {
  creator: Creator;
};

const Index = ({ creator }: CreatorPageProps) => {
  return (
    <>
      <Head>
        <title>{creator.name + " - Kroto"}</title>
      </Head>
      <CreatorPage creator={creator} />
    </>
  );
};

export async function getStaticPaths() {
  const creatorsData = await getCreators();

  return {
    paths: creatorsData.creators.map((c) => ({
      params: {
        creator_id: c.id,
      },
    })),
    fallback: "blocking",
  };
}

interface CParams extends ParsedUrlQuery {
  creator_id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const creatorsData = await getCreators();

  const creator = creatorsData.creators.find(
    (c: Creator) => c.id === (context.params as CParams).creator_id
  );

  if (!creator)
    return {
      notFound: true,
    };

  return {
    props: { creator },
  };
}

export default Index;
