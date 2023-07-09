import React, { type ChangeEvent, useEffect, useState } from "react";
import { object, string, date, literal } from "zod";
import LinkIcon from "@heroicons/react/20/solid/LinkIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateRandomGradientImages } from "@/helpers/randomGradientImages";
import Image from "next/image";
import Head from "next/head";
import { type UseFormProps, useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "@/utils/api";

import { useRouter } from "next/router";
import { Loader } from "@/components/Loader";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import Layout from "@/components/layouts/main";
import useToast from "@/hooks/useToast";
import { TimePicker, DatePicker, ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const titleLimit = 100;

export const createFormSchema = object({
  thumbnail: string().nonempty("Please upload a cover"),
  title: string().max(titleLimit).nonempty("Please enter event title."),
  description: string().max(3000).nonempty("Please enter event description."),
  eventType: string().nonempty("Please select the type of event."),
  eventUrl: string().url().optional().or(literal("")),
  eventLocation: string().optional().or(literal("")),
  datetime: date({
    required_error: "Please enter event's date and time.",
  }),
  endTime: date({
    required_error: "Please enter event's end date and time.",
  }),
  // duration: number({
  //   required_error: "Please enter event's duration.",
  // }).nonnegative(),
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
  const methods = useZodForm({
    schema: createFormSchema,
    defaultValues: {
      title: "",
      description: "",
      eventType: "virtual",
      eventUrl: "",
      eventLocation: "",
      datetime: new Date(),
      endTime: new Date(),
      // duration: 15,
      thumbnail: "",
    },
  });
  const router = useRouter();
  const { warningToast, errorToast } = useToast();

  const { mutateAsync: eventCreateMutation, isLoading: loading } =
    api.event.create.useMutation();

  const revalidate = useRevalidateSSG();

  useEffect(() => {
    methods.setValue("thumbnail", generateRandomGradientImages());
  }, [methods]);

  const { darkAlgorithm } = theme;
  const [startTime, setStartTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [endTime, setEndTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );

  return (
    <Layout>
      <Head>
        <title>Create Event</title>
      </Head>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          if (!!values) {
            const mValues = values;
            if (mValues.eventType === "virtual") mValues.eventLocation = "";
            else mValues.eventUrl = "";
            const stime = dayjs(startTime, "hh:mm A").toDate();
            const updateddt = new Date(values.datetime);
            updateddt.setHours(stime.getHours());
            updateddt.setMinutes(stime.getMinutes());
            const etime = dayjs(endTime, "hh:mm A").toDate();
            const updatedet = new Date(values.datetime);
            updatedet.setHours(etime.getHours());
            updatedet.setMinutes(etime.getMinutes());

            // const duration = (etime.getTime() - stime.getTime()) / 60000;

            try {
              await eventCreateMutation(
                {
                  title: values.title ?? "",
                  description: values.description ?? "",
                  thumbnail: values.thumbnail ?? "",
                  eventType: values.eventType ?? "",
                  eventLocation: values.eventLocation ?? "",
                  eventUrl: values.eventUrl ?? "",
                  datetime: updateddt,
                  endTime: updatedet,
                },
                {
                  onSuccess: (createdEvent) => {
                    if (createdEvent) {
                      void router.push(
                        `/creator/dashboard/event/${createdEvent.id}`
                      );
                      void revalidate(
                        `/${createdEvent?.creator?.creatorProfile ?? ""}`
                      );
                    }
                  },
                  onError: () => {
                    errorToast("Error in creating event!");
                  },
                }
              );
            } catch (err) {
              console.log(err);
            }
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
                  if (e.currentTarget.files[0].size > 1200000)
                    warningToast(
                      "Image is too big, try a smaller (<1MB) image for performance purposes."
                    );

                  if (e.currentTarget.files[0].size <= 3072000) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      methods.setValue("thumbnail", reader.result as string);
                    };
                    reader.readAsDataURL(e.currentTarget.files[0]);
                  } else {
                    warningToast("Upload cover image upto 3 MB of size.");
                  }
                }
              }}
            />
            <PhotoIcon className="w-4" />
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
            value={methods.watch()?.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              methods.setValue(
                "title",
                e.target?.value.substring(0, titleLimit)
              );
            }}
            placeholder="Event Title"
            className="w-full rounded-lg bg-neutral-800 px-3 py-2 font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500 sm:text-2xl"
          />
          {
            <p className="text-end text-neutral-400">
              {methods.watch()?.title?.length}/{titleLimit}
            </p>
          }
          {methods.formState.errors.title?.message && (
            <p className="text-red-700">
              {methods.formState.errors.title?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="description" className="text-lg  text-neutral-200">
            Description
          </label>
          <div data-color-mode="dark">
            <MDEditor
              height={350}
              value={methods.watch()?.description}
              onChange={(mdtext) => {
                methods.setValue("description", mdtext ?? "");
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
              <LinkIcon className="absolute ml-2 w-4 text-neutral-400 peer-focus:text-neutral-200" />
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
              <MapPinIcon className="absolute ml-2 w-4 text-neutral-400 peer-focus:text-neutral-200" />
            </div>

            {methods.formState.errors.eventLocation?.message && (
              <p className="text-red-700">
                {methods.formState.errors.eventLocation?.message}
              </p>
            )}
          </div>
        )}

        <div className="flex w-full flex-col items-start gap-3">
          <label htmlFor="og_description" className="text-lg  text-neutral-200">
            When is event taking place?
          </label>
          <div className="flex flex-col items-start gap-3 rounded-lg border border-neutral-700 bg-neutral-800 p-2">
            <ConfigProvider
              theme={{
                algorithm: darkAlgorithm,
                token: {
                  colorPrimary: "#ec4899",
                },
              }}
            >
              <DatePicker
                format="DD-MM-YYYY"
                autoFocus={false}
                bordered={false}
                disabledDate={(currentDate) =>
                  currentDate.isBefore(dayjs(new Date()), "day")
                }
                value={dayjs(
                  methods.watch()?.datetime?.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }),
                  "DD-MM-YYYY"
                )}
                onChange={(selectedDate) => {
                  const sourceDateObj = selectedDate?.toDate() ?? new Date();
                  const targetDateObj = methods.watch()?.datetime ?? new Date();
                  targetDateObj.setFullYear(sourceDateObj.getFullYear());
                  targetDateObj.setMonth(sourceDateObj.getMonth());
                  targetDateObj.setDate(sourceDateObj.getDate());
                  methods.setValue("datetime", targetDateObj);
                }}
              />
              <TimePicker.RangePicker
                autoFocus={false}
                bordered={false}
                order={false}
                className=""
                use12Hours
                value={[dayjs(startTime, "hh:mm A"), dayjs(endTime, "hh:mm A")]}
                onChange={(selectedTime) => {
                  if (selectedTime) {
                    setStartTime(
                      dayjs(selectedTime[0]).format("hh:mm A") ?? ""
                    );
                    setEndTime(dayjs(selectedTime[1]).format("hh:mm A"));
                  }
                }}
                format="hh:mm A"
                disabledTime={() => {
                  const now = dayjs();
                  return {
                    disabledHours: () => {
                      if (
                        dayjs(methods.watch()?.datetime).format(
                          "DD/MM/YYYY"
                        ) === dayjs(new Date()).format("DD/MM/YYYY")
                      )
                        return [...Array(now.hour()).keys()];
                      return [];
                    },
                    disabledMinutes: (selectedHour) => {
                      if (
                        dayjs(methods.watch()?.datetime).format(
                          "DD/MM/YYYY"
                        ) === dayjs(new Date()).format("DD/MM/YYYY")
                      ) {
                        if (now.hour() === selectedHour) {
                          return [...Array(now.minute()).keys()];
                        }
                        return [];
                      }
                      return [];
                    },
                  };
                }}
                minuteStep={15}
                style={{
                  color: "#fff",
                }}
              />
            </ConfigProvider>
            {/* <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" /> */}
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
          disabled={methods.formState.isSubmitting}
        >
          {loading && <Loader white />}
          Create Event
        </button>
      </form>
    </Layout>
  );
};

export default CreateEvent;
