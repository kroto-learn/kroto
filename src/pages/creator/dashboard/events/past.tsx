import DashboardEventsTabWrapper from "@/components/DashboardEventsTabWrapper";
import DashboardNavWrapper from "@/components/DashboardNavWrapper";
import Head from "next/head";
import React from "react";

const PastEvents = () => {
  return (
    <>
      <Head>
        <title>Past Events</title>
      </Head>
      <DashboardNavWrapper>
        <DashboardEventsTabWrapper>Events</DashboardEventsTabWrapper>
      </DashboardNavWrapper>
    </>
  );
};

export default PastEvents;
