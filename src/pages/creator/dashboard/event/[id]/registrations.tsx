import Head from "next/head";
import { useRouter } from "next/router";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import Image from "next/image";

const EventRegistrations = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event } = api.event.get.useQuery({ id });
  return (
    <>
      <Head>
        <title>{(event?.title as string) + "| Registrations"}</title>
      </Head>
      <div className="flex flex-col items-start justify-start gap-4 rounded-xl bg-neutral-900 p-6">
        <h3 className="text-xl">Registrations</h3>
        <table className="w-full overflow-hidden rounded-lg text-left text-sm text-neutral-300">
          <thead className="rounded-t-lg border border-neutral-600 bg-neutral-700 text-xs uppercase tracking-wider text-neutral-400">
            <tr>
              <th scope="col" className="py-3 pl-6 pr-2"></th>
              <th scope="col" className="px-6 py-3">
                Guest Name
              </th>
              <th scope="col" className="px-6 py-3">
                Guest Email
              </th>
            </tr>
          </thead>
          <tbody>
            {event?.registrations.map((r) => (
              <tr
                key={r?.id ?? ""}
                className="border-t border-neutral-700 bg-neutral-800"
              >
                <td className="py-4 pl-6 pr-2">
                  <div className="relative aspect-square h-4 w-4 overflow-hidden rounded-full object-cover">
                    <Image fill src={r?.image ?? ""} alt={r?.name ?? ""} />
                  </div>
                </td>
                <td
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-neutral-200"
                >
                  {r?.name ?? ""}
                </td>
                <td className="px-6 py-4"> {r?.email ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventRegistrations;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventRegistrations.getLayout = EventNestedLayout;
