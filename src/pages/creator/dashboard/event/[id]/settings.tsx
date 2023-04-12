import Head from "next/head";
import { useRouter } from "next/router";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import { AiOutlineDelete } from "react-icons/ai";

const EventSettings = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: event } = api.event.get.useQuery({ id });
  const { mutateAsync: deleteEventMutation } = api.event.delete.useMutation();

  return (
    <>
      <Head>
        <title>{(event?.title as string) + " | Settings"}</title>
      </Head>
      <div className="w-full rounded-xl bg-neutral-900 p-8">
        <div className="flex flex-col items-start gap-3">
          <label className="text-lg font-medium">
            Delete &quot;{event?.title ?? ""}&quot; event ?
          </label>
          <button
            onClick={async () => {
              try {
                await deleteEventMutation(
                  { id },
                  {
                    onSuccess: () => {
                      void router.replace("/creator/dashboard/events");
                    },
                  }
                );
              } catch (err) {
                console.log(err);
              }
            }}
            className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-red-500"
          >
            <AiOutlineDelete />
            Delete Event
          </button>
        </div>
      </div>
    </>
  );
};

export default EventSettings;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventSettings.getLayout = EventNestedLayout;
