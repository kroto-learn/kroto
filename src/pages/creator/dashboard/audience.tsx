import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import getCSV from "@/helpers/downloadCSV";
import React from "react";
import { useTable, type Column } from "react-table";
import Image from "next/image";
import { Loader } from "@/components/Loader";
import {
  FolderArrowDownIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
const Audience = () => {
  const { data: audience, isLoading } =
    api.creator.getAudienceMembers.useQuery();

  const tableData = React.useMemo(() => {
    if (audience)
      return audience.map((a) => ({
        col1: a?.image ?? "",
        col2: a?.name ?? "",
        col3: a?.email ?? "",
      }));
    return [];
  }, [audience]);

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
        Header: "Name",
        accessor: "col2",
      },
      {
        Header: "Email",
        accessor: "col3",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns: tableHeaders, data: tableData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  if (isLoading)
    return (
      <div className="my-12 flex h-[50vh] w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Audience | Dashboard</title>
      </Head>
      <div className="my-8 flex min-h-[80%] w-full flex-col items-start justify-start gap-4 px-6">
        <h3 className="mb-1 text-2xl font-medium">Audience</h3>
        <div className="mb-2 flex w-full items-start justify-between">
          <div className="flex flex-col items-start">
            <p className="text-3xl text-neutral-200">
              {audience?.length ?? "-"}
            </p>
          </div>
          <button
            disabled={audience?.length === 0 || !audience}
            type="button"
            className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            onClick={() => {
              getCSV(
                audience?.map((r) => ({
                  name: r.name,
                  email: r.email,
                  image: r.image,
                })) ?? []
              );
            }}
          >
            <FolderArrowDownIcon className="w-5" /> Download CSV
          </button>
        </div>
        {audience && audience.length > 0 ? (
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
                    // eslint-disable-next-line react/jsx-key
                    <tr
                      className="border-t border-neutral-700 bg-neutral-800"
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
                                  <Image
                                    fill
                                    src={(cell?.value as string) ?? ""}
                                    alt="image"
                                  />
                                </div>
                              </td>
                            );
                          return (
                            // eslint-disable-next-line react/jsx-key
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
          <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
            <div className="relative aspect-square w-40 object-contain">
              <Image src="/empty/users_empty.svg" alt="empty" fill />
            </div>
            <p className="text-neutral-400">
              You don&apos;t have any audience yet.
            </p>
            <p className="text-neutral-400">
              Do events to gather audience data.
            </p>
            <br />
            <Link
              href="/event/create"
              className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
            >
              <PlusIcon className="w-5" /> Create Event
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Audience;

Audience.getLayout = DashboardLayout;
