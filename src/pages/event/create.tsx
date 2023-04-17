import React, { useEffect } from "react";
import { object, string, number, date } from "zod";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineLink } from "react-icons/ai";
import { RxImage } from "react-icons/rx";
import { zodResolver } from "@hookform/resolvers/zod";
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
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import Layout from "@/components/layouts/main";
import useToast from "@/hooks/useToast";
import { TimePicker, DatePicker, ConfigProvider, theme } from "antd";
import dayjs from "dayjs";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

export const createFormSchema = object({
  thumbnail: string().nonempty("Please upload a cover"),
  title: string().nonempty("Please enter event title."),
  description: string().max(3000).nonempty("Please enter event description."),
  eventType: string().nonempty("Please select the type of event."),
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
  const { warningToast, errorToast } = useToast();

  const { mutateAsync: eventMutation, isLoading: loading } =
    api.event.create.useMutation();

  useEffect(() => {
    methods.setValue("thumbnail", generateRandomGradientImages());
  }, [methods]);

  const { darkAlgorithm } = theme;

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
            try {
              await eventMutation(
                { ...values },
                {
                  onSuccess: (createdEvent) => {
                    if (!(createdEvent instanceof TRPCError))
                      void router.push(
                        `/creator/dashboard/event/${createdEvent.id}`
                      );
                  },
                  onError: () => {
                    errorToast("Error in creating event.");
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
                    fileToBase64(e.currentTarget.files[0])
                      .then((b64) => {
                        if (b64) methods.setValue("thumbnail", b64);
                      })
                      .catch((err) => console.log(err));
                  } else {
                    warningToast("Upload cover image upto 3 MB of size.");
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
            placeholder="Event Title"
            className="w-full rounded-lg bg-neutral-800 px-3 py-2 font-medium  text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500 sm:text-2xl"
          />
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
                  currentDate.isBefore(dayjs(methods.watch()?.datetime), "day")
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
                className=""
                value={[
                  dayjs(
                    (() => {
                      const time = methods
                        .watch()
                        ?.datetime?.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });
                      const timearr = (time ?? "").split(" ");
                      const hmarr = timearr.join().split(":");
                      hmarr[1] = (
                        Math.ceil(parseInt(hmarr[1] ?? "0") / 15) * 15
                      ).toString();

                      timearr[0] = hmarr.join(":");
                      console.log(timearr.join(" "));

                      return timearr.join(" ");
                    })(),
                    "HH:mm A"
                  ),
                  dayjs(
                    (() => {
                      const time = methods
                        .watch()
                        ?.datetime?.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const timearr = (time ?? "").split(" ");
                      const hmarr = timearr.join().split(":");
                      hmarr[1] = (
                        Math.ceil(parseInt(hmarr[1] ?? "0") / 15) * 15 +
                        (methods.watch()?.duration ?? 0)
                      ).toString();

                      timearr[0] = hmarr.join(":");

                      return timearr.join(" ");
                    })(),
                    "HH:mm A"
                  ),
                ]}
                onChange={(selectedTime) => {
                  const starttime =
                    (selectedTime && selectedTime[0]) ?? dayjs();
                  const starttimeD = starttime.toDate() ?? new Date();
                  const targetDateObj = methods.watch()?.datetime ?? new Date();
                  targetDateObj.setHours(starttimeD.getHours());
                  targetDateObj.setMinutes(starttimeD.getMinutes());
                  targetDateObj.setSeconds(starttimeD.getSeconds());
                  targetDateObj.setMilliseconds(starttimeD.getMilliseconds());
                  methods.setValue("datetime", targetDateObj);

                  const endtime = (selectedTime && selectedTime[1]) ?? dayjs();
                  const endtimeD = endtime.toDate();

                  const diffInms = endtimeD.getTime() - starttimeD.getTime();
                  const diffInMinutes = diffInms / (1000 * 60);
                  methods.setValue("duration", diffInMinutes);
                }}
                format="HH:mm A"
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
                      if (now.hour() === selectedHour) {
                        return [...Array(now.minute()).keys()];
                      }
                      return [];
                    },
                  };
                }}
                minuteStep={15}
                use12Hours
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
        >
          {loading && <Loader />}
          Create Event
        </button>
      </form>
    </Layout>
  );
};

export default CreateEvent;
