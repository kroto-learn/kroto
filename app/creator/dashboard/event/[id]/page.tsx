import { getEventsClient } from "mock/getEventsClient";
import Head from "next/head";
import React from "react";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: "whfh456" }];
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const events = await getEventsClient();
  const event = events.find((e) => e.id === params.id);

  return {
    title: (event?.title as string) + "| Overview",
  };
}

export default async function EventOverview({ params }: Props) {
  const events = await getEventsClient();
  const event = events.find((e) => e.id === params.id);

  return (
    <>
      <Head>
        <title>{event?.title} | Manage</title>
      </Head>
      Hello
    </>
  );
}
