/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import getCSV from "@/helpers/downloadCSV";
import React, { Fragment, useState } from "react";
import { useTable, type Column } from "react-table";
import ImageWF from "@/components/ImageWF";
import { Loader } from "@/components/Loader";
import { PlusIcon, UserIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Transition, Dialog } from "@headlessui/react";
import Papa from "papaparse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimatedSection from "@/components/AnimatedSection";
import { faFileCsv, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/router";

const Audience = () => {
  const router = useRouter();
  const { audience } = router.query as { audience?: string };
  const isImportedTab = audience === "imported";
  const { data: audienceData, isLoading: isAudienceLoading } =
    api.creator.audience.getAudienceMembers.useQuery();

  const { data: importedAudienceData, isLoading: isImpAudLoading } =
    api.creator.audience.getImportedAudience.useQuery();

  const isLoading = isImportedTab ? isImpAudLoading : isAudienceLoading;

  const [uploadCSVModal, setUploadCSVModal] = useState(false);

  const tableData = React.useMemo(() => {
    if (audienceData)
      return audienceData.map((a) => ({
        col1: a?.image ?? "",
        col2: a?.name ?? "",
        col3: a?.email ?? "",
      }));
    return [];
  }, [audienceData]);

  const importedTableData = React.useMemo(() => {
    if (importedAudienceData)
      return importedAudienceData.map((a) => ({
        col1: a?.email ?? "",
      }));
    return [];
  }, [importedAudienceData]);

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

  const importedTableHeaders: readonly Column<{
    col1: string;
  }>[] = React.useMemo(
    () => [
      {
        Header: "Email",
        accessor: "col1",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns: tableHeaders, data: tableData });
  const importedTableInstance = useTable({
    columns: importedTableHeaders,
    data: importedTableData,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const {
    getTableProps: getImpTableProps,
    getTableBodyProps: getImpTableBodyProps,
    headerGroups: impHeaderGroups,
    rows: impRows,
    prepareRow: prepareImpRows,
  } = importedTableInstance;

  if (isLoading)
    return (
      <>
        <Head>
          <title>Audience | Dashboard</title>
        </Head>
        <div className="my-12 flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Audience | Dashboard</title>
      </Head>
      <div className="mx-2 my-8 min-h-[80%] w-full max-w-3xl px-6">
        <h3 className="mb-4 text-2xl font-medium">Audience</h3>
        <AnimatedSection className="mb-6 flex w-full items-start justify-between gap-2">
          <div className="flex flex-col items-start">
            <p className="text-3xl text-neutral-200">
              {audienceData?.length ?? "-"}
            </p>
          </div>
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              onClick={() => {
                setUploadCSVModal(true);
              }}
            >
              <FontAwesomeIcon icon={faFileArrowUp} /> Upload CSV
            </button>
            <button
              disabled={audienceData?.length === 0 || !audienceData}
              type="button"
              className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              onClick={() => {
                getCSV(
                  audienceData?.map((r) => ({
                    NAME: r.name,
                    EMAIL: r.email,
                    IMAGE: r.image,
                  })) ?? []
                );
              }}
            >
              <FontAwesomeIcon icon={faFileCsv} /> Download CSV
            </button>
          </div>
        </AnimatedSection>
        <div className="flex w-full justify-start">
          <div className="mb-6 border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <ul className="-mb-px flex flex-wrap">
              <li className="mr-2">
                <Link
                  href="/creator/dashboard/audience"
                  className={`inline-block rounded-t-lg p-4 ${
                    !isImportedTab
                      ? "border-b-2 border-pink-500 text-pink-500 transition"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                >
                  Normal
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/dashboard/audience?audience=imported"
                  className={`inline-block rounded-t-lg p-4 transition ${
                    isImportedTab
                      ? "border-b-2 border-pink-500 text-pink-500"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                  aria-current="page"
                >
                  Imported
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {!isImportedTab ? (
          audienceData && audienceData.length > 0 ? (
            <AnimatedSection delay={0.2} className="h-[80vh] overflow-scroll">
              <table
                {...getTableProps()}
                className="block w-full border-collapse overflow-auto text-left text-sm text-neutral-300 md:table"
              >
                <thead>
                  {
                    // Loop over the header rows
                    headerGroups.map((headerGroup) => (
                      // Apply the header row props
                      // eslint-disable-next-line react/jsx-key
                      <tr
                        className="border-neutral-600 bg-neutral-700 text-xs uppercase tracking-wider text-neutral-400"
                        {...headerGroup.getHeaderGroupProps()}
                      >
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
                        // eslint-disable-next-line react/jsx-key
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
            </AnimatedSection>
          ) : (
            <AnimatedSection
              delay={0.2}
              className="flex w-full flex-col items-center justify-center gap-2 p-4"
            >
              <div className="relative aspect-square w-40 object-contain">
                <ImageWF src="/empty/users_empty.svg" alt="empty" fill />
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
            </AnimatedSection>
          )
        ) : importedAudienceData && importedAudienceData.length > 0 ? (
          <AnimatedSection delay={0.2} className="h-[80vh] overflow-scroll">
            <table
              {...getImpTableProps()}
              className="block w-full border-collapse overflow-auto text-left text-sm text-neutral-300 md:table"
            >
              <thead>
                {
                  // Loop over the header rows
                  impHeaderGroups.map((headerGroup) => (
                    // Apply the header row props
                    // eslint-disable-next-line react/jsx-key
                    <tr
                      className="border-neutral-600 bg-neutral-700 text-xs uppercase tracking-wider text-neutral-400"
                      {...headerGroup.getHeaderGroupProps()}
                    >
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

              <tbody {...getImpTableBodyProps()}>
                {
                  // Loop over the table rows
                  impRows.map((row) => {
                    // Prepare the row for display
                    prepareImpRows(row);
                    return (
                      // Apply the row props
                      // eslint-disable-next-line react/jsx-key
                      <tr
                        className="border border-neutral-800 bg-neutral-900 even:bg-neutral-800"
                        {...row.getRowProps()}
                      >
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => (
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
                          ))
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
            delay={0.2}
            className="flex w-full flex-col items-center justify-center gap-2 p-4"
          >
            <div className="relative aspect-square w-40 object-contain">
              <ImageWF src="/empty/users_empty.svg" alt="empty" fill />
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
          </AnimatedSection>
        )}
      </div>
      <UploadCSVModal isOpen={uploadCSVModal} setIsOpen={setUploadCSVModal} />
    </>
  );
};

type UCMProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadCSVModal = ({ isOpen, setIsOpen }: UCMProps) => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const { mutateAsync: importAudienceMutation, isLoading: importLoading } =
    api.creator.audience.importAudience.useMutation();

  const { errorToast, successToast } = useToast();
  const ctx = api.useContext();

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setIsOpen(false);
            setSelectedEmails([]);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-neutral-800 p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-between">
                      <h3 className="ml-2 text-xl font-medium text-neutral-200">
                        Upload CSV
                      </h3>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setSelectedEmails([]);
                        }}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="flex flex-col gap-4 p-2">
                    {/* dialog content */}
                    {
                      <>
                        <p className="mb-2 text-lg">
                          Import your <span className="font-medium">.csv</span>{" "}
                          file and populate it into your Audience data.
                        </p>
                        {selectedEmails.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            <p className="text-xl">
                              <span className="font-bold">
                                {selectedEmails.length}
                              </span>{" "}
                              Emails selected
                            </p>
                            {/* <p className="text-sm">
                              <span className="rounded-lg bg-neutral-600 p-1 px-2 text-xs">
                                {!!selectedEmails[0] ? selectedEmails[0] : ""}
                              </span>
                              {selectedEmails[1] ? (
                                <>
                                  ,
                                  <span className="ml-2 rounded-lg bg-neutral-600 p-1 px-2 text-xs">
                                    {selectedEmails[1]}
                                  </span>
                                </>
                              ) : (
                                <></>
                              )}
                              <span>
                                {selectedEmails.length > 2
                                  ? `, and ${selectedEmails.length - 2} more`
                                  : ""}
                              </span>
                            </p> */}
                            <div className="h-32 w-full overflow-scroll">
                              <table className="w-full border-collapse">
                                <tbody>
                                  {selectedEmails.map((se) => (
                                    <tr
                                      key={se}
                                      className="bg-neutral-800 even:bg-neutral-700"
                                    >
                                      <td className="border-collapse border border-neutral-700 p-1 px-3 ">
                                        {se}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23DB2777FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
                          }}
                          className="relative m-4 mx-auto flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-pink-600/10 p-4 py-8"
                        >
                          <p>Drag and drop .csv files here</p>
                          <p>or</p>
                          <div className="cursor-pointer rounded-lg bg-pink-500/50 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-pink-500 hover:text-neutral-200">
                            Upload CSV
                            <input
                              type="file"
                              accept=".csv"
                              onChange={(e) => {
                                const [csvfile] = e.target.files ?? [null];

                                if (csvfile) {
                                  const reader = new FileReader();
                                  reader.onloadend = ({ target }) => {
                                    if (target?.result) {
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      const csv: { data: { email: string }[] } =
                                        Papa.parse(
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          target.result,
                                          {
                                            header: true,
                                            transformHeader: (header) =>
                                              header.toLowerCase(),
                                          }
                                        );
                                      setSelectedEmails([
                                        ...selectedEmails,
                                        ...csv.data.map((c) => c.email),
                                      ]);
                                    }
                                  };
                                  reader.readAsText(csvfile);
                                }
                              }}
                              className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                            />
                          </div>
                        </div>
                        <p className="mb-2">
                          We will scrape column with header{" "}
                          <span className="rounded-lg bg-neutral-700 p-1 px-2 text-xs font-bold text-neutral-200">
                            EMAIL
                          </span>{" "}
                          from your CSV file.
                        </p>
                      </>
                    }
                  </div>
                  {
                    <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                      <button
                        onClick={() => {
                          void importAudienceMutation(
                            { email: selectedEmails },
                            {
                              onSuccess: () => {
                                void ctx.creator.audience.getImportedAudience.invalidate();
                                successToast(
                                  "Audience imported from CSV successfully!"
                                );
                                setIsOpen(false);
                                setSelectedEmails([]);
                              },
                              onError: () => {
                                errorToast(
                                  "Error in importing audience from CSV!"
                                );
                              },
                            }
                          );
                        }}
                        className="cursor-pointer rounded-lg bg-pink-500/50 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-pink-500 hover:text-neutral-200"
                      >
                        {importLoading ?? <Loader />}
                        Import Emails
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setSelectedEmails([]);
                        }}
                        className="rounded-lg bg-neutral-600 px-5 py-2.5 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200"
                      >
                        Cancel
                      </button>
                    </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Audience;

Audience.getLayout = DashboardLayout;
