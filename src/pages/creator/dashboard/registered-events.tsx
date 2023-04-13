import { EventCard } from "@/components/EventCard";
import Head from "next/head";
import React, { useEffect } from "react";
import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { DashboardLayout } from ".";

const RegisteredEvents = () => {
  const { data: creator, isLoading: isCreatorLoading } =
    api.creator.getProfile.useQuery();

  useEffect(() => {
    console.log(creator);
  }, [creator]);

  if (isCreatorLoading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      <div className="flex flex-col items-start gap-4 px-8 py-12">
        <h3 className="text-2xl font-medium">Registered Events</h3>
        <div className="flex w-full flex-col items-start gap-4">
          {creator?.registrations.map((event) => (
            <EventCard key={event?.id ?? ""} manage event={event} />
          ))}
        </div>
      </div>
    </>
  );
};

RegisteredEvents.getLayout = DashboardLayout;

export default RegisteredEvents;
