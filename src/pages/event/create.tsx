import React, { useEffect, useState } from "react";
import { object, string, number, date } from "zod";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineLink } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar3Event } from "react-icons/bs";
import { BiTime, BiTimeFive } from "react-icons/bi";
import { RxImage } from "react-icons/rx";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateTimesArray,
  giveFirstTimeIdx,
  updateTime,
} from "@/helpers/time";
import fileToBase64 from "@/helpers/file";
import { generateRandomGradientImages } from "@/helpers/randomGradientImages";
import Image from "next/image";
import Head from "next/head";
import { type UseFormProps, useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import { Loader } from "@/components/Loader";

export const createFormSchema = object({
  thumbnail: string({
    required_error: "Please upload a cover",
  }),
  title: string({
    required_error: "Please enter event title.",
  }),
  description: string({
    required_error: "Please enter event description.",
  }).max(1500),
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

const CreateEvent = () => {
  const times = generateTimesArray();
  const minTimeIdx = giveFirstTimeIdx(times);
  const [startTimeIdx, setStartTimeIdx] = useState<number>(minTimeIdx);
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useZodForm({
    schema: createFormSchema,
    defaultValues: {
      title: "",
      description: "",
      eventType: "virtual",
      eventUrl: "",
      eventLocation: "",
      datetime: new Date(),
      duration: 15,
      thumbnail: "",
    },
  });
  const router = useRouter();

  const eventMutation = api.event.create.useMutation().mutateAsync;

  useEffect(() => {
    methods.setValue("thumbnail", generateRandomGradientImages());
  }, [methods]);

  return (
    <>
      <Head>
        <title>Create Event</title>
      </Head>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          if (!!values) {
            console.log(values);
            const mValues = values;
            if (mValues.eventType === "virtual") mValues.eventLocation = "";
            else mValues.eventUrl = "";
            setLoading(true);
            try {
              await eventMutation(
                { ...values },
                {
                  onSuccess: (createdEvent) => {
                    if (!(createdEvent instanceof TRPCError))
                      void router.push(`/event/${createdEvent.id}`);
                  },
                }
              );
            } catch (err) {
              console.log(err);
            }
            setLoading(false);
          }
        })}
        className="mx-auto my-12 flex w-full max-w-2xl flex-col gap-8"
      >
        <div className="relative flex aspect-[18/9] w-full items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
          {!!methods.getValues("thumbnail") && (
            <Image
              src={methods.getValues("thumbnail")}
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
                  fileToBase64(e.currentTarget.files[0])
                    .then((b64) => {
                      if (b64) methods.setValue("thumbnail", b64);
                    })
                    .catch((err) => console.log(err));
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
            placeholder="Event Title"
            className="w-full rounded-lg bg-neutral-800 px-3 py-2 font-medium  text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500 sm:text-2xl"
          />
          {methods.formState.errors.title?.message && (
            <p className="text-red-700">
              {methods.formState.errors.title?.message}
            </p>
          )}
        </div>

        {/* TODO: Make it a rich text editor */}
        <div className="flex flex-col gap-3">
          <label htmlFor="description" className="text-lg  text-neutral-200">
            Description
          </label>
          <textarea
            rows={8}
            {...methods.register("description")}
            className="w-full rounded-lg bg-neutral-800 px-3 py-2  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
          />
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
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
              >
                {"💻️ "} Virutal
              </label>
            </li>
            <li>
              <input
                type="radio"
                value="in_person"
                className="peer hidden"
                id="in_person"
                {...methods.register("eventType")}
                name="eventType"
              />
              <label
                htmlFor="in_person"
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
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
                placeholder="Google Meet or YouTube URL"
                className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
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
                placeholder="Your event's address"
                className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
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
          <label htmlFor="og_description" className="text-lg  text-neutral-200">
            When is event taking place?
          </label>
          <div className="relative flex max-w-[10rem] items-center">
            <DatePicker
              selected={new Date(methods.getValues("datetime"))}
              minDate={new Date(Date.now() + 15 * 60 * 1000)}
              dateFormat="E, d MMM"
              className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-[2.5rem] font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
              onChange={(newDate) => {
                if (newDate) methods.setValue("datetime", newDate);
              }}
            />
            <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex max-w-[10rem] items-center">
              <select
                className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8 font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
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
                      methods.getValues("datetime")
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
                className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8 font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
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
                    new Date(methods.getValues("datetime")).toDateString() ===
                    new Date().toDateString()
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
        </div>

        <button
          className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center text-lg font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
          type="submit"
        >
          {loading && <Loader />}
          Create Event
        </button>
      </form>
      {/* );
      }} */}
      {/* </Formik> */}
    </>
  );
};

export default CreateEvent;
