import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, type ReactNode } from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";

const EventSettings = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: event } = api.event.get.useQuery({ id });
  const { mutateAsync: deleteEventMutation, isLoading } =
    api.event.delete.useMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{(event?.title ?? "Event") + " | Settings"}</title>
      </Head>
      <div className="w-full rounded-xl bg-neutral-900 p-8">
        <div className="flex flex-col items-start gap-3">
          <label className="text-lg font-medium">
            Delete &quot;{event?.title ?? ""}&quot; event ?
          </label>
          <button
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-red-500"
          >
            <TrashIcon className="w-5" />
            Delete Event
          </button>
        </div>
      </div>

      <div
        className={`fixed left-0 right-0 top-0 z-50 flex h-full max-h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/10 p-2 backdrop-blur-sm md:inset-0 ${
          !deleteModalOpen ? "hidden" : ""
        }`}
      >
        <div className="relative max-h-full w-full max-w-lg">
          {/* <!-- Modal content --> */}
          <div className="relative rounded-lg bg-neutral-800 shadow">
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-end rounded-t p-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
              >
                <XMarkIcon className="w-5" />
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="space-y-6 p-2">
              <p className="px-4 text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                Are you sure you want to delete the{" "}
                <span className="font-medium">
                  &quot;{event?.title ?? ""}
                  &quot;
                </span>{" "}
                event?
              </p>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
              <button
                type="button"
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
                className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-red-500 hover:text-neutral-200"
              >
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="mr-3 inline h-4 w-4 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <></>
                )}{" "}
                Delete Event
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
                className="rounded-lg bg-neutral-600 px-5 py-2.5 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>
          </div>
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
