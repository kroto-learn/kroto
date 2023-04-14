/* eslint-disable react/jsx-key */
import Head from "next/head";
import { useRouter } from "next/router";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import Image from "next/image";
import { RiFileDownloadLine } from "react-icons/ri";
import getCSV from "@/helpers/downloadCSV";
import { type Column, useTable } from "react-table";
import { RxAvatar } from "react-icons/rx";

const EventRegistrations = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event } = api.event.get.useQuery({ id });

  const tableData = React.useMemo(() => {
    if (event && event?.registrations)
      return event.registrations.map((r) => ({
        col1: r.image ?? "",
        col2: r.name ?? "",
        col3: r.email ?? "",
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
        Header: <RxAvatar />,
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

  return (
    <>
      <Head>
        <title>{(event?.title ?? "Event") + " | Registrations"}</title>
      </Head>
      <div className="flex min-h-[80%] w-full flex-col items-start justify-start gap-4 rounded-xl bg-neutral-900 p-6">
        <h3 className="mb-1 text-2xl font-medium">Registrations</h3>
        <div className="mb-2 flex w-full items-start justify-between">
          <div className="flex flex-col items-start">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-300">
              Total Registrations
            </label>
            <p className="text-3xl text-neutral-200">
              {event?.registrations.length ?? "-"}
            </p>
          </div>
          <button
            type="button"
            className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 hover:bg-pink-600 hover:text-neutral-200"
            onClick={() => {
              getCSV(
                event?.registrations?.map((r) => ({
                  name: r.name,
                  email: r.email,
                  image: r.image,
                })) ?? []
              );
            }}
          >
            <RiFileDownloadLine /> Download CSV
          </button>
        </div>
        {event?.registrations && event.registrations.length > 0 ? (
          <table
            {...getTableProps()}
            className="w-full overflow-hidden rounded-lg text-left text-sm text-neutral-300"
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
                        <th className="px-6 py-3" {...column.getHeaderProps()}>
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
                      className="border-t border-neutral-700 bg-neutral-800"
                      {...row.getRowProps()}
                    >
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          console.log("cell", cell);
                          if (cell.column.id === "img")
                            return (
                              <td className="py-4 pl-6 pr-2">
                                <div className="relative aspect-square h-4 w-4 overflow-hidden rounded-full object-cover">
                                  <Image
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
        ) : (
          <div className="w-full p-4">
            <p>No registrations yet</p>
          </div>
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
