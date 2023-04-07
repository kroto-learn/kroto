"use client";

import React, { useEffect, useState } from "react";
import { Formik, ErrorMessage, Form, Field, useFormikContext } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, number } from "zod";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineLink } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar3Event } from "react-icons/bs";
import { BiTime, BiTimeFive } from "react-icons/bi";
import { RxImage } from "react-icons/rx";
import {
  generateTimesArray,
  giveFirstTimeIdx,
  updateTimeInISOString,
} from "@/helpers/time";
import fileToBase64 from "@/helpers/file";
import { generateRandomGradientImages } from "@/helpers/randomGradientImages";
import Image from "next/image";

const CreateEvent = () => {
  const times = generateTimesArray();
  const minTimeIdx = giveFirstTimeIdx(times);
  const [startTimeIdx, setStartTimeIdx] = useState<number>(minTimeIdx);

  const createFormSchema = object({
    thumbnail: string({
      required_error: "Please upload a cover",
    }),
    title: string({
      required_error: "Please enter event title.",
    }),
    og_description: string({
      required_error: "Please enter event short(og) description.",
    }).max(150),

    description: string({
      required_error: "Please enter event description.",
    }).max(150),
    event_type: string({
      required_error: "Please select the type of event.",
    }).max(150),
    event_url: string().url().optional(),
    event_location: string().optional(),
    datetime: string({
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
          return data.event_type === "virtual"
            ? data.event_url !== undefined && data.event_url !== ""
            : data.event_location !== undefined && data.event_location !== "";
        else return false;
      },
      (data) => {
        if (data)
          return {
            message:
              data && data.event_type === "virtual"
                ? "Please enter the event URL."
                : "Please enter the event location.",
          };
        else
          return {
            message: "",
          };
      }
    );

  return (
    <Formik
      initialValues={{
        title: "",
        og_description: "",
        description: "",
        event_type: "virtual",
        event_url: "",
        event_location: "",
        datetime: new Date().toISOString(),
        duration: 15,
        thumbnail: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        const mValues = values;
        if (mValues.event_type === "virtual") mValues.event_location = "";
        else mValues.event_url = "";

        alert(JSON.stringify(values, null, 2));
        console.log(JSON.stringify(values, null, 2));

        setSubmitting(false);
      }}
      validationSchema={toFormikValidationSchema(createFormSchema)}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        return (
          <Form className="mx-auto my-12 flex w-full max-w-2xl flex-col gap-8">
            <div className="relative flex aspect-[18/9] w-full items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
              {values.thumbnail && (
                <Image
                  src={values.thumbnail}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              )}
              <div className="relative m-2 flex w-auto cursor-pointer items-center gap-2 rounded-xl border border-neutral-500 bg-neutral-500/50 p-3 text-sm font-medium duration-300 hover:border-neutral-400">
                <LoadInitialThumbnail />
                <input
                  type="file"
                  accept="image/*"
                  className=" z-2 absolute h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    if (e.currentTarget.files && e.currentTarget.files[0]) {
                      fileToBase64(e.currentTarget.files[0])
                        .then((b64) => {
                          if (b64) setFieldValue("thumbnail", b64);
                        })
                        .catch((err) => console.log(err));
                    }
                  }}
                />
                <RxImage />
                Upload Cover
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="title" className="text-lg  text-neutral-200">
                Event Title
              </label>
              <Field
                name="title"
                type="text"
                id="title"
                placeholder="Event Title"
                className="w-full rounded-lg bg-neutral-800 px-3 py-2 font-medium  text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500 sm:text-2xl"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-700"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="og_description"
                className="text-lg  text-neutral-200"
              >
                Short Description
              </label>
              <Field
                name="og_description"
                type="text"
                id="og_description"
                className="w-full rounded-lg bg-neutral-800 px-3 py-2  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
              />
              <ErrorMessage
                name="og_description"
                component="div"
                className="text-red-700"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                Description
              </label>
              <Field
                rows={8}
                name="description"
                type="text"
                id="description"
                as="textarea"
                className="w-full rounded-lg bg-neutral-800 px-3 py-2  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-700"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="event_type" className="text-lg  text-neutral-200">
                Where is event taking place?
              </label>

              <ul className="flex items-center gap-2">
                <li>
                  <Field
                    type="radio"
                    id="virtual"
                    value="virtual"
                    className="peer hidden"
                    name="event_type"
                  />
                  <label
                    htmlFor="virtual"
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
                  >
                    {"💻️ "} Virutal
                  </label>
                </li>
                <li>
                  <Field
                    type="radio"
                    id="in_person"
                    value="in_person"
                    className="peer hidden"
                    name="event_type"
                  />
                  <label
                    htmlFor="in_person"
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm font-medium text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 peer-checked:border-pink-600 peer-checked:bg-pink-600/20 peer-checked:text-neutral-200"
                  >
                    {"🌎️ "} In Person
                  </label>
                </li>
              </ul>

              <ErrorMessage
                name="event_type"
                component="div"
                className="text-red-700"
              />
            </div>

            {values.event_type === "virtual" ? (
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <Field
                    name="event_url"
                    type="text"
                    id="event_url"
                    placeholder="Google Meet or YouTube URL"
                    className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
                  />
                  <AiOutlineLink className="absolute ml-2 text-neutral-400 peer-focus:text-neutral-200" />
                </div>
                <ErrorMessage
                  name="event_url"
                  component="div"
                  className="text-red-700"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <Field
                    name="event_location"
                    type="text"
                    id="event_location"
                    placeholder="Your event's address"
                    className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8  font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
                  />
                  <HiOutlineLocationMarker className="absolute ml-2 text-neutral-400 peer-focus:text-neutral-200" />
                </div>

                <ErrorMessage
                  name="event_location"
                  component="div"
                  className="text-red-700"
                />
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
                  selected={new Date(values.datetime)}
                  minDate={new Date(Date.now() + 15 * 60 * 1000)}
                  dateFormat="E, d MMM"
                  className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-[2.5rem] font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
                  onChange={(newDate) => {
                    if (newDate)
                      setFieldValue("datetime", newDate.toISOString());
                  }}
                />
                <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex max-w-[10rem] items-center">
                  <select
                    className="w-full rounded-lg bg-neutral-800 px-3 py-2 pl-8 font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
                    onChange={(e) => {
                      setFieldValue(
                        "datetime",
                        updateTimeInISOString(
                          values.datetime,
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
                        return new Date(values.datetime).toDateString() ===
                          new Date().toDateString()
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
                      setFieldValue(
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
                        new Date(values.datetime).toDateString() ===
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

              <ErrorMessage
                name="datetime"
                component="div"
                className="text-red-700"
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

const LoadInitialThumbnail = () => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("thumbnail", generateRandomGradientImages());
  }, [setFieldValue]);

  return <></>;
};

export default CreateEvent;
