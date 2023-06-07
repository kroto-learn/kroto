import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import useToast from "@/hooks/useToast";
import { type RouterOutputs, api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import AnimatedSection from "./AnimatedSection";
import { TRPCError } from "@trpc/server";
import ImageWF from "./ImageWF";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";
import { Loader } from "./Loader";

export default function AddHostModal({
  eventId,
  isOpen,
  hosts,
  setIsOpen,
  refetch,
}: {
  eventId: string;
  isOpen: boolean;
  hosts: RouterOutputs["eventHost"]["getHosts"];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}) {
  const [creatorId, setCreatorId] = useState<string>("");
  const { successToast, errorToast } = useToast();

  const { mutateAsync: addHostMutation, isLoading } =
    api.eventHost.addHost.useMutation();
  const revalidate = useRevalidateSSG();
  const ctx = api.useContext();

  const handleSubmit = async () => {
    await addHostMutation(
      { eventId, creatorId },
      {
        onSuccess: () => {
          successToast("Host added successfully!");
          void revalidate(`/event/${eventId}`);
          void ctx.event.get.invalidate();
        },
        onError: () => {
          errorToast("Error in adding host!");
        },
      }
    );
    refetch();
  };

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
          <AnimatedSection
            delay={0.3}
            className="fixed inset-0 overflow-y-auto"
          >
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
                        Add Host
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
                  <div className="flex flex-col gap-4 p-6">
                    <p className="text-neutral-300">
                      Add host&apos;s creator id {"(kroto.in/creatorId)"}
                    </p>
                    <div className="flex">
                      <label className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Email
                      </label>
                      <div className="relative w-full">
                        <input
                          value={creatorId}
                          onChange={(e) => setCreatorId(e.target.value)}
                          className="block w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-sm placeholder-neutral-400 outline-none ring-transparent transition hover:border-neutral-600 focus:border-neutral-500 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                          placeholder="Enter the creator id"
                          required
                        />
                        <button
                          onClick={() => handleSubmit()}
                          className="absolute right-0 top-0 flex items-center gap-1 rounded-r-lg border border-pink-700 bg-pink-700 p-2.5 text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          {isLoading ? (
                            <Loader white />
                          ) : (
                            <UserPlusIcon className="w-4" />
                          )}{" "}
                          Add Host
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-5 px-4 pb-4">
                      {!(hosts instanceof TRPCError) &&
                        hosts?.map((host) => (
                          <div
                            key={host?.id}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`relative aspect-square w-[1.7rem] overflow-hidden rounded-full`}
                            >
                              <ImageWF
                                src={host?.user?.image ?? ""}
                                alt={host?.user?.name ?? ""}
                                fill
                              />
                            </div>
                            <p className={`text-neutral-300 transition-all`}>
                              {host?.user?.name ?? ""}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </AnimatedSection>
        </Dialog>
      </Transition>
    </>
  );
}
