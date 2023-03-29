import type { Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import type { GetStaticPropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import React from "react";

type CreatorPageProps = {
  creator: Creator | null;
};

const CreatorPage = ({ creator }: CreatorPageProps) => {
  return <div>{creator?.id}</div>;
};

export async function getStaticPaths() {
  const creatorsData = await getCreators();

  return {
    paths: creatorsData.creators.map((c) => ({
      params: {
        creator_id: c.id,
      },
    })),
    fallback: false,
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

  return {
    props: { creator },
  };
}

export default CreatorPage;
