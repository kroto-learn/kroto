import { Dialog, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import CalenderBox from "@/components/CalenderBox";
import React, { type ReactNode, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "../..";
import { api } from "@/utils/api";
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

const EventEditModal = dynamic(() => import("@/components/EventEditModal"), {
  ssr: false,
});
import { MdLocationOn } from "react-icons/md";
import { SiGooglemeet } from "react-icons/si";
import dynamic from "next/dynamic";
import {
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

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

  const date = event && event.datetime ? new Date(event.datetime) : new Date();

  // const { data: creator } = api.creator.getProfile.useQuery();

  // useEffect(() => {
  //   if (!creator?.isCreator) {
  //     void router.push("/");
  //   }
  // }, [creator, router]);

  if (isEventLoading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  if (event)
    return (
      <>
        <Head>
          <title>{`${event?.title ?? "Event"} | Overview`}</title>
        </Head>
        <div className="flex w-full max-w-3xl flex-col justify-start gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="flex w-full items-start gap-8">
            <div className="flex flex-col items-start gap-4">
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

            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <h3 className="font-medium text-neutral-200">When & Where</h3>
                <div className="flex gap-2">
                  <CalenderBox date={event?.datetime ?? new Date()} />
                  <p className="text-left text-sm  font-medium text-neutral-300">
                    {date?.toLocaleString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    <br />
                    {date?.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    to{" "}
                    {new Date(
                      (event?.datetime?.getTime() ?? 0) +
                        (event?.duration ?? 0) * 60000
                    )?.toLocaleString("en-US", {
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
          </div>

          <div className="flex w-full items-center justify-between gap-12">
            <button
              onClick={() => {
                setEditEvent(true);
              }}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              <PencilIcon className="w-3" />
              Edit Event
            </button>

            <div className="flex items-center gap-2">
              <p>Share Event</p>
              <LinkedinShareButton
                url={`https://kroto.in/event/${event?.id ?? ""}`}
              >
                <LinkedinIcon size={24} round />
              </LinkedinShareButton>
              <FacebookShareButton
                className=""
                url={`https://kroto.in/event/${event?.id ?? ""}`}
                quote={`Join the "${event?.title ?? ""}" event on Kroto.in`}
                hashtag={"#kroto"}
              >
                <FacebookIcon size={24} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`https://kroto.in/event/${event?.id ?? ""}`}
                title={`Join the "${event?.title ?? ""}" event on Kroto.in`}
              >
                <TwitterIcon size={24} round />
              </TwitterShareButton>
              <WhatsappShareButton
                url={`https://kroto.in/event/${event?.id ?? ""}`}
                title={`Join the "${event?.title ?? ""}" event on Kroto.in`}
                separator=":: "
              >
                <WhatsappIcon size={24} round />
              </WhatsappShareButton>
            </div>
          </div>
        </div>

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
                          <Loader />
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
  refetch,
}: {
  eventId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}) {
  const [creatorId, setCreatorId] = useState<string>("");
  const { successToast, errorToast } = useToast();

  const { mutateAsync: addHostMutation, isLoading } =
    api.event.addHost.useMutation();

  const handleSubmit = async () => {
    const data = await addHostMutation({ eventId, creatorId });
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-neutral-200"
                  >
                    Add host&apos;s creator id {"(kroto.in/creatorId)"}
                  </Dialog.Title>
                  <div className="mt-2">
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
                            <Loader />
                          ) : (
                            <UserPlusIcon className="w-4" />
                          )}{" "}
                          Add Host
                        </button>
                      </div>
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
      <div className="flex w-full items-start justify-between gap-4 px-4">
        <h1 className="text-xl text-neutral-200">{event?.title}</h1>
        <Link
          href={`/event/${id}`}
          className="flex min-w-[10rem] items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <GlobeAltIcon className="w-3" /> Event Public Page
        </Link>
      </div>
      <div className="border-b border-neutral-200 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${id}`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname === `/creator/dashboard/event/${id}`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
            >
              Overview
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${id}/registrations`}
              className={`inline-block rounded-t-lg p-4 ${
                pathname === `/creator/dashboard/event/${id}/registrations`
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-300"
              }`}
              aria-current="page"
            >
              Registrations
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`/creator/dashboard/event/${id}/settings`}
              className={`inline-block rounded-t-lg p-4 ${
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
