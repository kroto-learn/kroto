import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type SetStateAction } from "react";
import React, { type ReactNode, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { DashboardLayout } from "../..";
import { type RouterOutputs, api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  PencilIcon,
  XMarkIcon,
  RocketLaunchIcon,
  LinkIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { TRPCError } from "@trpc/server";
import AnimatedSection from "@/components/AnimatedSection";
const CalenderBox = dynamic(() => import("@/components/CalenderBox"), {
  ssr: false,
});
const EventLayoutR = dynamic(
  () => import("@/components/layouts/eventDashboard"),
  {
    ssr: false,
  }
);
const EventStateBanner = dynamic(
  () => import("@/components/EventStateBanner"),
  {
    ssr: false,
  }
);
const Hosts = dynamic(() => import("@/components/EventHosts"), {
  ssr: false,
});
const AddHostModal = dynamic(() => import("@/components/AddHostModal"), {
  ssr: false,
});
const EventEditModal = dynamic(() => import("@/components/EventEditModal"), {
  ssr: false,
});
const SendUpdateModal = dynamic(() => import("@/components/SendUpdateModal"), {
  ssr: false,
});

const EventOverview = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event, isLoading: isEventLoading } = api.event.get.useQuery({
    id,
  });

  const [editEvent, setEditEvent] = useState(false);
  const [sendUpdate, setSendUpdate] = useState(false);

  const [open, setIsOpen] = useState<boolean>(false);

  const [startEventModal, setStartEventModal] = useState(false);

  const { successToast } = useToast();

  if (event instanceof TRPCError || !event) return <>Event not found!</>;

  const { data: hosts, refetch: refetchHosts } =
    api.eventHost.getHosts.useQuery({
      eventId: event?.id ?? "",
    });

  const { mutateAsync: addToCalendarMutation, isLoading: addingToCalendar } =
    api.emailSender.sendCalendarInvite.useMutation();

  const isEventOver = event && event?.endTime?.getTime() < new Date().getTime();

  if (isEventLoading)
    return (
      <>
        <Head>
          <title> Event | Overview</title>
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  if (event)
    return (
      <>
        <Head>
          <title>{`${event?.title ?? "Event"} | Overview`}</title>
        </Head>
        <EventStateBanner setStartEventModal={setStartEventModal} />
        <AnimatedSection delay={0.2} className="flex w-full max-w-3xl flex-col justify-start gap-4 rounded-xl bg-neutral-800 p-4">
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
              {!isEventOver ? (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  {event?.eventType === "virtual" ? (
                    <FontAwesomeIcon
                      icon={faVideo}
                      className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-neutral-400"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-neutral-400"
                    />
                  )}
                  <p>
                    {event?.eventType === "virtual"
                      ? "Google Meet"
                      : event?.eventLocation}
                  </p>
                </div>
              ) : (
                <></>
              )}
              {!isEventOver ? (
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
              ) : (
                <></>
              )}
              {isEventOver ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {event.registrations.length}{" "}
                    </span>
                    <span className="text-lg">Registrations</span>
                    <Link
                      href={`/creator/dashboard/event/${event.id}/registrations`}
                      className="text-sm text-neutral-400 duration-150 hover:text-pink-600 hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {!isEventOver ? (
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
            </div>
          ) : (
            <></>
          )}
        </AnimatedSection>

        {/* start event confirmation modal */}
        <StartEventModal
          isOpen={startEventModal}
          setIsOpen={setStartEventModal}
          event={event}
        />

        {!isEventOver ? (
          <AnimatedSection delay={0.2} className="flex w-full flex-col gap-2 md:flex-row">
            <button
              onClick={() => {
                setSendUpdate(true);
              }}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              <EnvelopeIcon className="w-3" />
              Send email update
            </button>

            <button
              onClick={async () => {
                await addToCalendarMutation({ eventId: event?.id ?? "" });
              }}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              {addingToCalendar ? <Loader /> : <CalendarIcon className="w-3" />}
              Send calendar invite
            </button>
          </AnimatedSection>
        ) : (
          <></>
        )}

        {/* hosts */}

        <Hosts setIsHostModalOpen={setIsOpen} />
        <AddHostModal
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

        {/* send update email drawer */}

        <div
          className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
            sendUpdate ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => {
              setSendUpdate(false);
            }}
            className="self-start rounded-xl border border-neutral-500 p-1 text-xl text-neutral-400"
          >
            <XMarkIcon className="w-5" />
          </button>

          <SendUpdateModal eventId={event?.id ?? ""} />
        </div>
      </>
    );
  else return <></>;
};

type SEProps = {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  event: RouterOutputs["event"]["get"];
};

const StartEventModal = ({ isOpen, setIsOpen, event }: SEProps) => {
  const { mutateAsync: sendNotification, isLoading } =
    api.emailSender.eventStarting.useMutation();

  if (event instanceof TRPCError || !event) return <>Event not found!</>;

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
                    <button
                      onClick={async () => {
                        await sendNotification({ eventId: event?.id ?? "" });
                        if (!isLoading) {
                          const newWindow = window.open(
                            event?.eventUrl ?? "",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          if (newWindow) newWindow.opener = null;
                        }
                        setIsOpen(false);
                      }}
                      className="rounded-lg bg-pink-500/50 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-pink-500 hover:text-neutral-200"
                    >
                      {isLoading ?? <Loader />}
                      Start Event
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

function EventLayout(page: ReactNode) {
  return <EventLayoutR>{page}</EventLayoutR>;
}

export { EventLayout };
