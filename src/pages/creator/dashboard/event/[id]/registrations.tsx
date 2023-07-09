/* eslint-disable react/jsx-key */
import Head from "next/head";
import { useRouter } from "next/router";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import ImageWF from "@/components/ImageWF";
import getCSV from "@/helpers/downloadCSV";
import { type Column, useTable } from "react-table";
import {
  FolderArrowDownIcon,
  LinkIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import {
  LinkedinShareButton,
  LinkedinIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";

import AnimatedSection from "@/components/AnimatedSection";

const EventRegistrations = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event, isLoading } = api.event.get.useQuery({ id });

  const tableData = React.useMemo(() => {
    if (event && event?.registrations)
      return event.registrations.map((r) => ({
        col1: r.user?.image ?? "",
        col2: r.user?.name ?? "",
        col3: r.user?.email ?? "",
      }));
    return [];
  }, [event]);

  const tableHeaders: readonly Column<{
    col1: string;
    col2: string;
    col3: string;
  }>[] = React.useMemo(
    () => [
      {
        id: "img",
        Header: <UserIcon className="w-5" />,
        accessor: "col1",
      },
      {
        Header: "Guest name",
        accessor: "col2",
      },
      {
        Header: "Guest email",
        accessor: "col3",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns: tableHeaders, data: tableData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const { successToast } = useToast();

  if (!event) return <>Event not found!</>;

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader size="lg" />
  //     </div>
  //   );
  // }

  return (
    <>
      <Head>
        <title>{(event?.title ?? "Event") + " | Registrations"}</title>
      </Head>
      <div className="min-h-[80%] w-full max-w-3xl p-6">
        <h3 className="mb-4 text-lg font-medium  sm:text-2xl">Registrations</h3>
        <AnimatedSection
          delay={0.2}
          className="mb-4 flex w-full items-start justify-between"
        >
          <div className="flex flex-col items-start">
            <p className="text-3xl text-neutral-200">
              {event?.registrations.length ?? "-"}
            </p>
          </div>
          <button
            disabled={event?.registrations.length === 0 || !event}
            type="button"
            className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            onClick={() => {
              getCSV(
                event?.registrations?.map((r) => ({
                  name: r.user?.name,
                  email: r.user?.email,
                  image: r.user?.image,
                })) ?? []
              );
            }}
          >
            <FolderArrowDownIcon className="w-5" /> Download CSV
          </button>
        </AnimatedSection>
        {event?.registrations &&
        event.registrations.length > 0 &&
        !isLoading ? (
          <AnimatedSection delay={0.3} className="h-[55vh] overflow-scroll">
            <table
              {...getTableProps()}
              className="block w-full border-collapse overflow-auto text-left text-sm text-neutral-300 md:table"
            >
              <thead className="rounded-t-lg border border-neutral-600 bg-neutral-700 text-xs uppercase tracking-wider text-neutral-400">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    // eslint-disable-next-line react/jsx-key
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          // eslint-disable-next-line react/jsx-key
                          <th
                            className="px-6 py-3"
                            {...column.getHeaderProps()}
                          >
                            {
                              // Render the header
                              column.render("Header")
                            }
                          </th>
                        ))
                      }
                    </tr>
                  ))
                }
              </thead>

              <tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  rows.map((row) => {
                    // Prepare the row for display
                    prepareRow(row);
                    return (
                      // Apply the row props
                      <tr
                        className="border border-neutral-800 bg-neutral-900 even:bg-neutral-800"
                        {...row.getRowProps()}
                      >
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            if (cell.column.id === "img")
                              return (
                                <td className="py-4 pl-6 pr-2">
                                  <div className="relative aspect-square h-4 w-4 overflow-hidden rounded-full object-cover">
                                    <ImageWF
                                      fill
                                      src={(cell?.value as string) ?? ""}
                                      alt="image"
                                    />
                                  </div>
                                </td>
                              );
                            return (
                              <td
                                className="whitespace-nowrap px-6 py-4 font-medium text-neutral-200"
                                {...cell.getCellProps()}
                              >
                                {
                                  // Render the cell contents
                                  cell.render("Cell")
                                }
                              </td>
                            );
                          })
                        }
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </AnimatedSection>
        ) : (
          <AnimatedSection
            delay={0.3}
            className="flex w-full flex-col items-center justify-center gap-2 p-4"
          >
            {isLoading ? (
              <div className="my-10">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <div className="relative aspect-square w-40 object-contain">
                  <ImageWF src="/empty/users_empty.svg" alt="empty" fill />
                </div>
                <p className="text-center text-neutral-400">
                  Nobody registered to your event yet.
                </p>
                <p className="mb-2 text-center text-neutral-400">
                  Share the event in your community.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="aspect-square rounded-full bg-neutral-700 p-2 grayscale duration-300 hover:bg-neutral-600 hover:grayscale-0"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `https://kroto.in/event/${event?.id ?? ""}`
                      );
                      successToast("Event URL copied to clipboard!");
                    }}
                  >
                    <LinkIcon className="w-3" />
                  </button>
                  <LinkedinShareButton
                    url={`https://kroto.in/event/${event?.id ?? ""}`}
                  >
                    <LinkedinIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </LinkedinShareButton>
                  <FacebookShareButton
                    url={`https://kroto.in/event/${event?.id ?? ""}`}
                    quote={`Join the "${event?.title ?? ""}" event on Kroto.in`}
                    hashtag={"#kroto"}
                  >
                    <FacebookIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`https://kroto.in/event/${event?.id ?? ""}`}
                    title={`Join the "${event?.title ?? ""}" event on Kroto`}
                  >
                    <TwitterIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={`https://kroto.in/event/${event?.id ?? ""}`}
                    title={`Join the "${event?.title ?? ""}" event on Kroto.in`}
                    separator=": "
                  >
                    <WhatsappIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </WhatsappShareButton>
                </div>
              </>
            )}
          </AnimatedSection>
        )}
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
