import Head from "next/head";
import { useRouter } from "next/router";
import React, {
  useState,
  type ReactNode,
  type Dispatch,
  Fragment,
  type SetStateAction,
} from "react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import { api } from "@/utils/api";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Transition, Dialog } from "@headlessui/react";
import { Loader } from "@/components/Loader";

const EventSettings = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: event } = api.event.get.useQuery({ id });

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
            className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            <TrashIcon className="w-3" />
            Delete Event
          </button>
        </div>
      </div>

      <DeleteEventModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        eventTitle={event?.title ?? ""}
      />
    </>
  );
};

export function DeleteEventModal({
  isOpen,
  setIsOpen,
  eventTitle,
}: {
  eventTitle: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutateAsync: deleteEventMutation, isLoading } =
    api.event.delete.useMutation();
  const router = useRouter();
  const { id } = router.query as { id: string };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
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
                        Delete Event
                      </h3>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="space-y-6 p-4">
                    <p className="text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Are you sure you want to delete the{" "}
                      <span className="font-medium">
                        &quot;{eventTitle}
                        &quot;
                      </span>{" "}
                      event?
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteEventMutation(
                            { id },
                            {
                              onSuccess: () => {
                                void router.replace(
                                  "/creator/dashboard/events"
                                );
                              },
                            }
                          );
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-red-500 hover:text-neutral-200"
                    >
                      {isLoading ? <Loader /> : <></>} Delete Event
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className="rounded-lg bg-neutral-600 px-5 py-2.5 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default EventSettings;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventSettings.getLayout = EventNestedLayout;
