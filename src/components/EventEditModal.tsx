import fileToBase64 from "@/helpers/file";
import useToast from "@/hooks/useToast";
import { type RouterInputs, api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, DatePicker, TimePicker, theme } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { AiOutlineLink } from "react-icons/ai";
import { RxImage } from "react-icons/rx";
import { date, number, object, string, type z } from "zod";
import dayjs from "dayjs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const editEventFormSchema = object({
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

const EventEditModal = () => {
  const { mutateAsync: eventUpdateMutation, isLoading: isUpdateLoading } =
    api.event.update.useMutation();
  type EventUpdateType = RouterInputs["event"]["update"];
  const ctx = api.useContext();
  const [eventInit, setEventInit] = useState(false);

  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: event } = api.event.get.useQuery({
    id,
  });

  const { errorToast, warningToast } = useToast();

  const methods = useZodForm({
    schema: editEventFormSchema,
    defaultValues: {
      datetime: new Date(),
    },
  });

  const { darkAlgorithm } = theme;

  useEffect(() => {
    if (!!event && !eventInit) {
      setEventInit(true);
      methods.setValue("thumbnail", (event?.thumbnail as string) ?? "");
      methods.setValue("datetime", event?.datetime ?? new Date());
      methods.setValue("duration", (event?.duration as number) ?? "");
      methods.setValue("eventType", event?.eventType ?? "");
      methods.setValue("description", event?.description ?? "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit(async (values) => {
        if (!!values) {
          const mValues = values;
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
                if (e.currentTarget.files[0].size > 1200000)
                  warningToast(
                    "Image is too big, try a smaller (<1MB) image for performance purposes."
                  );
                if (e.currentTarget.files[0].size <= 3072000)
                  fileToBase64(e.currentTarget.files[0])
                    .then((b64) => {
                      if (b64) methods.setValue("thumbnail", b64);
                    })
                    .catch((err) => console.log(err));
                else {
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
          defaultValue={(event && event.title) ?? ""}
          placeholder="Event Title"
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium  text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400 sm:text-lg"
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
              className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-xs font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
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
              className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8 text-sm text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
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
              className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8 text-sm text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400"
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
              autoFocus={false}
              format="DD-MM-YYYY"
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
                const starttime = (selectedTime && selectedTime[0]) ?? dayjs();
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
                      dayjs(methods.watch()?.datetime).format("DD/MM/YYYY") ===
                      dayjs(new Date()).format("DD/MM/YYYY")
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
  );
};

export default EventEditModal;
