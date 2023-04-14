"use client";

import CalenderBox from "@/components/CalenderBox";
import fileToBase64 from "@/helpers/file";
import "react-datepicker/dist/react-datepicker.css";
import {
  generateTimesArray,
  giveFirstTimeIdx,
  updateTime,
} from "@/helpers/time";
import Image from "next/image";
import React, { type ReactNode, useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { BiTime, BiTimeFive } from "react-icons/bi";
import { BsCalendar3Event, BsGlobe } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { RxImage } from "react-icons/rx";
import { SiGooglemeet } from "react-icons/si";
import { date, number, object, string, type z } from "zod";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "../..";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterInputs, api } from "@/utils/api";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

// FIXME: time logic fix

const editEventFormSchema = object({
  thumbnail: string({
    required_error: "Please upload a cover",
  }),
  title: string({
    required_error: "Please enter event title.",
  }),
  description: string({
    required_error: "Please enter event description.",
  }).max(3000),
  eventType: string({
    required_error: "Please select the type of event.",
  }).max(150),
  eventUrl: string().url().optional(),
  eventLocation: string().optional(),
  datetime: date({
    required_error: "Please enter event's date and time.",
  }),
  duration: number({
    required_error: "Please enter event's duration.",
  }).nonnegative(),
})
  .optional()
  .refine(
    (data) => {
      if (data)
        return data.eventType === "virtual"
          ? data.eventUrl !== undefined && data.eventUrl !== ""
          : data.eventLocation !== undefined && data.eventLocation !== "";
      else return false;
    },
    (data) => {
      if (data)
        return {
          message:
            data && data.eventType === "virtual"
              ? "Please enter the event URL."
              : "Please enter the event location.",
        };
      else
        return {
          message: "",
        };
    }
  );

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const EventOverview = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event, isLoading: isEventLoading } = api.event.get.useQuery({
    id,
  });
  const [eventInit, setEventInit] = useState(false);
  const { mutateAsync: eventUpdateMutation, isLoading: isUpdateLoading } =
    api.event.update.useMutation();
  type EventUpdateType = RouterInputs["event"]["update"];
  const ctx = api.useContext();

  const times = generateTimesArray();
  const minTimeIdx = giveFirstTimeIdx(times);

  const [startTimeIdx, setStartTimeIdx] = useState<number>(
    giveFirstTimeIdx(times, event ? event?.datetime : new Date())
  );

  const [editEvent, setEditEvent] = useState(false);

  const date = event && event.datetime ? new Date(event.datetime) : new Date();

  const endTime =
    event && event.datetime
      ? new Date(new Date(event.datetime).getTime() + 3600000)
      : new Date();

  const methods = useZodForm({
    schema: editEventFormSchema,
    defaultValues: {
      datetime: new Date(),
    },
  });

  const { warningToast } = useToast();

  useEffect(() => {
    if (!!event && !eventInit) {
      setEventInit(true);
      methods.setValue("thumbnail", (event?.thumbnail as string) ?? "");
      methods.setValue("datetime", event?.datetime ?? new Date());
      methods.setValue("duration", (event?.duration as number) ?? "");
      methods.setValue("eventType", event?.eventType ?? "");
      methods.setValue("description", event?.description ?? "");

      setStartTimeIdx(
        giveFirstTimeIdx(times, event ? event.datetime : new Date())
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const { errorToast } = useToast();

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
        <div className="flex w-full max-w-3xl items-start gap-8 rounded-xl bg-neutral-800 p-4">
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
            <button
              onClick={() => {
                setEditEvent(true);
              }}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              <FiEdit2 className="" />
              Edit Event
            </button>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-neutral-200">When & Where</h3>
              <div className="flex gap-2">
                <CalenderBox date={new Date()} />
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
                  {endTime?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />{" "}
                <p>Google Meet</p>
              </div>
            </div>
          </div>
        </div>

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
            <MdClose />
          </button>

          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={methods.handleSubmit(async (values) => {
              if (!!values) {
                const mValues = values;
                console.log(mValues?.thumbnail);
                if (mValues.eventType === "virtual") mValues.eventLocation = "";
                else mValues.eventUrl = "";
                try {
                  await eventUpdateMutation(
                    {
                      ...values,
                      id: id,
                    } as EventUpdateType,
                    {
                      onSuccess: () => {
                        void ctx.event.get.invalidate();
                      },
                      onError: () => {
                        errorToast("Error in updating the event.");
                      },
                    }
                  );
                } catch (err) {
                  console.log(err);
                }
              }
            })}
            className="mx-auto my-4 flex w-full max-w-2xl flex-col gap-8"
          >
            <div className="relative flex aspect-[18/9] w-full items-end justify-start overflow-hidden rounded-xl bg-neutral-700 text-sm">
              {!!methods.getValues("thumbnail") && (
                <Image
                  src={methods.watch()?.thumbnail ?? ""}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              )}
              <div className="relative m-2 flex w-auto cursor-pointer items-center gap-2 rounded-xl border border-neutral-500 bg-neutral-800/80 p-3 text-sm font-medium duration-300 hover:border-neutral-400">
                <input
                  type="file"
                  accept="image/*"
                  className="z-2 absolute h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    if (e.currentTarget.files && e.currentTarget.files[0]) {
                      if (e.currentTarget.files[0].size <= 5120000)
                        fileToBase64(e.currentTarget.files[0])
                          .then((b64) => {
                            if (b64) methods.setValue("thumbnail", b64);
                          })
                          .catch((err) => console.log(err));
                      else {
                        warningToast("Upload cover image upto 5 MB of size.");
                      }
                    }
                  }}
                />
                <RxImage />
                Upload Cover
              </div>
            </div>

            {methods.formState.errors.thumbnail?.message && (
              <p className="text-red-700">
                {methods.formState.errors.thumbnail?.message}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <label htmlFor="title" className="text-lg  text-neutral-200">
                Event Title
              </label>
              <input
                {...methods.register("title")}
                defaultValue={(event && event.title) ?? ""}
                placeholder="Event Title"
                className="w-full rounded-lg bg-neutral-700 px-3 py-2 text-sm font-medium  text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400 sm:text-lg"
              />
              {methods.formState.errors.title?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.title?.message}
                </p>
              )}
            </div>

            {/* TODO: Make it a rich text editor */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                Description
              </label>
              {/* <textarea
                rows={8}
                {...methods.register("description")}
                defaultValue={(event && event.description) ?? ""}
                className="w-full rounded-lg bg-neutral-700 px-3 py-2 text-sm text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
              /> */}
              <div data-color-mode="dark">
                <MDEditor
                  height={200}
                  value={methods.watch()?.description}
                  onChange={(mdtext) => {
                    if (mdtext) methods.setValue("description", mdtext);
                  }}
                />
              </div>
              {methods.formState.errors.description?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.description?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="eventType" className="text-lg  text-neutral-200">
                Where is event taking place?
              </label>

              <ul className="flex items-center gap-2">
                <li>
                  <input
                    type="radio"
                    value="virtual"
                    id="virtual"
                    className="peer hidden"
                    {...methods.register("eventType")}
                    name="eventType"
                  />
                  <label
                    htmlFor="virtual"
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-700 p-3 text-xs font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
                  >
                    {"💻️ "} Virutal
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="in_person"
                    id="in_person"
                    className="peer hidden"
                    {...methods.register("eventType")}
                    name="eventType"
                  />
                  <label
                    htmlFor="in_person"
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-700 p-3 text-xs font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
                  >
                    {"🌎️ "} In Person
                  </label>
                </li>
              </ul>

              {methods.formState.errors.eventType?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.eventType?.message}
                </p>
              )}
            </div>

            {methods.watch()?.eventType === "virtual" ? (
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <input
                    key="eventUrl"
                    {...methods.register("eventUrl")}
                    defaultValue={(event && event.eventUrl) ?? ""}
                    placeholder="Google Meet or YouTube URL"
                    className="w-full rounded-lg bg-neutral-700 px-3 py-2 pl-8 text-sm text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
                  />
                  <AiOutlineLink className="absolute ml-2 text-neutral-400 peer-focus:text-neutral-200" />
                </div>
                {methods.formState.errors.eventUrl?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.eventUrl?.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <input
                    key="eventLocation"
                    {...methods.register("eventLocation")}
                    defaultValue={(event && event.eventLocation) ?? ""}
                    placeholder="Your event's address"
                    className="w-full rounded-lg bg-neutral-700 px-3 py-2 pl-8 text-sm text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
                  />
                  <HiOutlineLocationMarker className="absolute ml-2 text-neutral-400 peer-focus:text-neutral-200" />
                </div>

                {methods.formState.errors.eventLocation?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.eventLocation?.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex w-full flex-col gap-3">
              <label
                htmlFor="og_description"
                className="text-lg  text-neutral-200"
              >
                When is event taking place?
              </label>
              <div className="relative flex max-w-[10rem] items-center">
                <DatePicker
                  selected={new Date(methods.getValues("datetime"))}
                  minDate={new Date(Date.now() + 15 * 60 * 1000)}
                  dateFormat="E, d MMM"
                  className="w-full rounded-lg bg-neutral-700 px-3 py-2 pl-[2.5rem] text-sm font-medium text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
                  onChange={(newDate) => {
                    if (newDate) methods.setValue("datetime", newDate);
                  }}
                />
                <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex max-w-[10rem] items-center">
                  <select
                    className="w-full rounded-lg bg-neutral-700 px-3 py-2 pl-8 text-sm font-medium text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
                    onChange={(e) => {
                      methods.setValue(
                        "datetime",
                        updateTime(
                          methods.getValues("datetime") ?? new Date(),
                          times[parseInt(e.target.value)] as string
                        )
                      );
                      setStartTimeIdx(parseInt(e.target.value));
                    }}
                  >
                    {times
                      .map((time, idx) => (
                        <option
                          selected={idx === startTimeIdx}
                          key={time}
                          value={idx}
                        >
                          {time}
                        </option>
                      ))
                      .filter((e, idx) => {
                        return new Date(
                          methods.getValues("duration")
                        ).toDateString() === new Date().toDateString()
                          ? idx >= minTimeIdx
                          : true;
                      })}
                  </select>
                  <BiTime className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" />
                </div>

                {" to "}

                <div className="relative flex max-w-[10rem] items-center">
                  <select
                    className="w-full rounded-lg bg-neutral-700 px-3 py-2 pl-8 text-sm font-medium text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
                    onChange={(e) => {
                      methods.setValue(
                        "duration",
                        (parseInt(e.target.value) - startTimeIdx) * 15
                      );
                    }}
                  >
                    {times
                      .map((time, idx) => (
                        <option key={time} value={idx}>
                          {time}
                        </option>
                      ))
                      .filter((e, idx) =>
                        new Date(
                          methods.getValues("duration")
                        ).toDateString() === new Date().toDateString()
                          ? idx > startTimeIdx
                          : true
                      )}
                    {startTimeIdx === 92 ? (
                      <option value={1}>12:00 AM</option>
                    ) : (
                      <></>
                    )}
                  </select>
                  <BiTimeFive className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" />
                </div>
              </div>

              {methods.formState.errors.datetime?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.datetime?.message}
                </p>
              )}
              {methods.formState.errors.duration?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.duration?.message}
                </p>
              )}
            </div>

            <button
              className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem]  py-2 text-center font-medium text-neutral-200 transition-all duration-300 disabled:bg-neutral-700 disabled:text-neutral-300`}
              type="submit"
            >
              {isUpdateLoading ? (
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
              Update Event
            </button>
          </form>
        </div>
      </>
    );
  else return <></>;
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
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <h1 className="text-2xl text-neutral-200">{event?.title}</h1>
        <Link
          href={`/event/${id}`}
          className="flex items-center gap-2 rounded-xl border border-pink-600 px-3 py-[0.35rem] text-xs font-medium text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
        >
          <BsGlobe /> Event Public Page
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
