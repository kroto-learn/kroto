import { Dialog, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import CalenderBox from "@/components/CalenderBox";
import React, { type ReactNode, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "../..";
import { type RouterOutputs, api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";

// import EventEditModal from "@/components/EventEditModal";

const EventEditModal = dynamic(() => import("@/components/EventEditModal"), {
  ssr: false,
});
import { MdLocationOn } from "react-icons/md";
import { SiGooglemeet } from "react-icons/si";
import dynamic from "next/dynamic";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  RocketLaunchIcon,
  LinkIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

import useRevalidateSSG from "@/hooks/useRevalidateSSG";

const EventOverview = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event, isLoading: isEventLoading } = api.event.get.useQuery({
    id,
  });

  const [editEvent, setEditEvent] = useState(false);
  const [open, setIsOpen] = useState<boolean>(false);

  const { data: hosts, refetch: refetchHosts } = api.event.getHosts.useQuery({
    eventId: event?.id ?? "",
  });

  const { mutateAsync: removeHost, isLoading: removingHost } =
    api.event.removeHost.useMutation();

  const [startEventModal, setStartEventModal] = useState(false);

  const { successToast } = useToast();

  if (isEventLoading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  if (event)
    return (
      <>
        <Head>
          <title>{`${event?.title ?? "Event"} | Overview`}</title>
        </Head>
        {(event?.datetime?.getTime() as number) <= new Date().getTime() &&
        (event?.endTime?.getTime() as number) >= new Date().getTime() ? (
          <div className="flex w-full items-center justify-between gap-4 rounded-xl bg-neutral-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
                <span className="h-4/5 w-4/5 rounded-full bg-pink-500"></span>
              </span>
              The Event is Live Now.
            </div>
            {event.eventType === "virtual" ? (
              <button
                onClick={() => {
                  setStartEventModal(true);
                }}
                className={`group inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/20 px-4 py-2 text-center text-xs font-medium text-pink-600 transition-all duration-300 hover:bg-pink-500 hover:text-neutral-200`}
              >
                Join Event <ArrowUpRightIcon className="w-4" />
              </button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        <div className="flex w-full max-w-3xl flex-col justify-start gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="flex w-full flex-col items-start gap-8 sm:flex-row">
            <div className="flex w-full flex-col items-start gap-4">
              <div
                className={`relative aspect-[18/9] w-full object-cover transition-all sm:w-[12rem] md:w-[16rem]`}
              >
                <Image
                  src={(event?.thumbnail as string) ?? ""}
                  alt={event?.title ?? ""}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3">
              <h3 className="font-medium text-neutral-200">When & Where</h3>
              <div className="flex gap-2">
                <CalenderBox date={event?.datetime ?? new Date()} />
                <p className="text-left text-sm  font-medium text-neutral-300">
                  {event.datetime?.toLocaleString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  <br />
                  {event.datetime?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  to{" "}
                  {event.endTime?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                {event?.eventType === "virtual" ? (
                  <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />
                ) : (
                  <MdLocationOn className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />
                )}
                <p>
                  {event?.eventType === "virtual"
                    ? "Google Meet"
                    : event?.eventLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setEditEvent(true);
                  // router.push(`${router.asPath}/edit`)
                }}
                className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
              >
                <PencilIcon className="w-3" />
                Edit Event
              </button>

              <button
                onClick={() => {
                  setStartEventModal(true);
                }}
                className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500/20 px-4 py-2 text-center text-xs font-medium text-pink-600  transition-all duration-300 hover:bg-pink-500 hover:text-neutral-200`}
              >
                <RocketLaunchIcon className="w-3" />
                Start Event
              </button>
            </div>

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
                title={`Join the "${event?.title ?? ""}" event on Kroto.in`}
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
          </div>
        </div>

        {/* start event confirmation modal */}
        <StartEventModal
          isOpen={startEventModal}
          setIsOpen={setStartEventModal}
          event={event}
        />

        <div className="w-full">
          <div className="my-5 flex w-full items-center justify-between">
            <h3 className="text-2xl font-medium text-neutral-200">Hosts</h3>
            <button
              onClick={() => setIsOpen(true)}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-sm font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              <UserPlusIcon className="w-4" /> Add Host
            </button>
          </div>
          <ul className="w-full divide-y divide-neutral-700">
            {hosts instanceof TRPCError
              ? ""
              : hosts?.map((host) => (
                  <li key={host?.id} className="py-3 sm:py-4">
                    <div className="flex w-full items-center space-x-4">
                      <div className="relative h-8 w-8 flex-shrink-0 rounded-full">
                        <Image
                          className="rounded-full"
                          src={host?.image ?? ""}
                          alt="host img"
                          fill
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-200">
                          {host?.name ?? ""}
                        </p>
                        <p className="truncate text-sm text-neutral-400">
                          {host?.email ?? ""}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          // TODO: implement remove host
                          // await removeHost({ hostId: host?.id ?? "" });
                          // void refetchHosts();
                        }}
                        className="flex items-center gap-1 rounded-xl border border-pink-700 bg-pink-700 p-1 px-2 text-sm font-medium text-white transition duration-300 hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                      >
                        {removingHost ? (
                          <Loader size="lg" />
                        ) : (
                          <TrashIcon className="w-4" />
                        )}{" "}
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
        <AddHostModel
          refetch={refetchHosts}
          eventId={event.id ?? ""}
          hosts={hosts ?? []}
          isOpen={open}
          setIsOpen={setIsOpen}
        />

        {/* side edit event drawer */}

        <div
          className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
            editEvent ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => {
              setEditEvent(false);
            }}
            className="self-start rounded-xl border border-neutral-500 p-1 text-xl text-neutral-400"
          >
            <XMarkIcon className="w-5" />
          </button>

          <EventEditModal />
        </div>
      </>
    );
  else return <></>;
};

export function AddHostModel({
  eventId,
  isOpen,
  setIsOpen,
  hosts,
  refetch,
}: {
  eventId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  hosts: RouterOutputs["event"]["getHosts"];
  refetch: () => void;
}) {
  const [creatorId, setCreatorId] = useState<string>("");
  const { successToast, errorToast } = useToast();

  const { mutateAsync: addHostMutation, isLoading } =
    api.event.addHost.useMutation();
  const revalidate = useRevalidateSSG();

  const handleSubmit = async () => {
    const data = await addHostMutation(
      { eventId, creatorId },
      {
        onSuccess: () => {
          void revalidate(`/event/${eventId}`);
        },
      }
    );
    if (data instanceof TRPCError) errorToast("something went wrong");
    else successToast("host added successfully");
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
                              <Image
                                src={host?.image ?? ""}
                                alt={host?.name ?? ""}
                                fill
                              />
                            </div>
                            <p className={`text-neutral-300 transition-all`}>
                              {host?.name ?? ""}
                            </p>
                          </div>
                        ))}
                    </div>
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

type SEProps = {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  event: RouterOutputs["event"]["get"];
};

const StartEventModal = ({ isOpen, setIsOpen, event }: SEProps) => {
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
                        Start Event
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
                  <div className="flex flex-col gap-1">
                    <p className="px-4 py-2 text-base leading-relaxed text-neutral-300">
                      Are you sure you want to start the{" "}
                      <span className="font-medium">
                        &quot;{event?.title ?? ""}
                        &quot;
                      </span>{" "}
                      event now?
                    </p>
                    <br />
                    <p className="px-4 text-base leading-relaxed text-neutral-300">
                      A notification will be send to all the registered users.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                    <Link
                      href={
                        event?.eventType === "virtual"
                          ? event?.eventUrl ?? ""
                          : ":"
                      }
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      target="_blank"
                      type="button"
                      className="rounded-lg bg-pink-500/50 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-pink-500 hover:text-neutral-200"
                    >
                      Start Event
                    </Link>
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

      {/* <div className="relative max-h-full max-w-lg">
        <div className="relative rounded-lg bg-neutral-800 shadow">
          <div className="flex items-start justify-end rounded-t p-2">
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
          
        </div>
      </div> */}
    </>
  );
};

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

EventOverview.getLayout = EventNestedLayout;

export default EventOverview;

function EventLayoutR({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event } = api.event.get.useQuery({ id });

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 px-4 md:flex-row">
        <h1 className="truncate text-xl text-neutral-200">{event?.title}</h1>
        <Link
          href={`/event/${id}`}
          className="flex min-w-[7rem] items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200 sm:min-w-[10rem]"
        >
          <GlobeAltIcon className="w-4" /> Event Public Page
        </Link>
      </div>
      <div className="border-b border-neutral-700 text-center text-sm font-medium text-neutral-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/creator/dashboard/event/${id}`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-1 sm:mr-2">
            <Link
              href={`/creator/dashboard/event/${id}/registrations`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}/registrations`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Registrations
            </Link>
          </li>
          <li>
            <Link
              href={`/creator/dashboard/event/${id}/settings`}
              className={`inline-block rounded-t-lg px-2 py-4 text-xs sm:p-4 sm:text-base ${
                pathname === `/creator/dashboard/event/${id}/settings`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}

function EventLayout(page: ReactNode) {
  return <EventLayoutR>{page}</EventLayoutR>;
}

export { EventLayout };
