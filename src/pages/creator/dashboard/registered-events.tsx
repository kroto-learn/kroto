import { EventCard } from "@/components/EventCard";
import Head from "next/head";
import React, { useEffect } from "react";
import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { DashboardLayout } from ".";
import Image from "next/image";

const RegisteredEvents = () => {
  const { data: creator, isLoading: isCreatorLoading } =
    api.creator.getProfile.useQuery();

  if (isCreatorLoading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Events | Dashboard</title>
      </Head>
      <div className="flex flex-col items-start gap-4 px-8 py-12">
        <h3 className="text-2xl font-medium">Registered Events</h3>
        {creator?.registrations && creator.registrations.length > 0 ? (
          <div className="flex w-full flex-col items-start gap-4">
            {creator?.registrations.map((event) => (
              <EventCard key={event?.id ?? ""} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
            <div className="relative aspect-square w-40 object-contain">
              <Image src="/empty/event_empty.svg" alt="empty" fill />
            </div>
            <p className="mb-2 text-neutral-400">
              You have not registered to any events yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

RegisteredEvents.getLayout = DashboardLayout;

export default RegisteredEvents;
