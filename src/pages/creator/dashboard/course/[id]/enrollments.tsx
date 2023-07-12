/* eslint-disable react/jsx-key */
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { CourseNestedLayout } from ".";
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
import AnimatedSection from "@/components/AnimatedSection";
import { Loader } from "@/components/Loader";

const CourseEnrollment = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: course, isLoading } = api.course.get.useQuery({ id });
  const { successToast } = useToast();

  const tableData = React.useMemo(() => {
    if (course && course?.enrollments)
      return course.enrollments.map((r) => ({
        col1: r.user?.image ?? "",
        col2: r.user?.name ?? "",
        col3: r.user?.email ?? "",
      }));
    return [];
  }, [course]);

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

  if (!course) return <>Not Found</>;

  const courseUrl = `https://kroto.in/course/${course?.id ?? ""}`;

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
        <title>{(course?.title ?? "Course") + " | Enrollments"}</title>
      </Head>
      <div className="min-h-[80%] w-full max-w-3xl p-6">
        <h3 className="mb-4 text-lg font-medium  sm:text-2xl">Enrollments</h3>
        <AnimatedSection
          delay={0.1}
          className="mb-4 flex w-full items-start justify-between"
        >
          <div className="flex flex-col items-start">
            <p className="text-3xl text-neutral-200">
              {course?.enrollments.length ?? "-"}
            </p>
          </div>
          <button
            disabled={course?.enrollments.length === 0 || !course}
            type="button"
            className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            onClick={() => {
              getCSV(
                course?.enrollments?.map((r) => ({
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
        {course?.enrollments && course.enrollments.length > 0 && !isLoading ? (
          <AnimatedSection delay={0.2} className="h-[55vh] overflow-scroll">
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
            delay={0.2}
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
                  Nobody enrolled to your course yet.
                </p>
                <p className="mb-2 text-center text-neutral-400">
                  Share the course in your community.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="aspect-square rounded-full bg-neutral-700 p-2 grayscale duration-300 hover:bg-neutral-600 hover:grayscale-0"
                    onClick={() => {
                      void navigator.clipboard.writeText(courseUrl);
                      successToast("Event URL copied to clipboard!");
                    }}
                  >
                    <LinkIcon className="w-3" />
                  </button>
                  <LinkedinShareButton url={courseUrl}>
                    <LinkedinIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </LinkedinShareButton>
                  <FacebookShareButton
                    url={courseUrl}
                    quote={`Enroll for the "${
                      course?.title ?? ""
                    }" course on Kroto.in`}
                    hashtag={"#kroto"}
                  >
                    <FacebookIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={courseUrl}
                    title={`Enroll for the "${
                      course?.title ?? ""
                    }" course on Kroto`}
                  >
                    <TwitterIcon
                      size={28}
                      round
                      className="grayscale duration-300 hover:grayscale-0"
                    />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={`https://kroto.in/event/${course?.id ?? ""}`}
                    title={`Enroll for the "${
                      course?.title ?? ""
                    }" course on Kroto.in`}
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

CourseEnrollment.getLayout = CourseNestedLayout;

export default CourseEnrollment;
