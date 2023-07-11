import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, DatePicker, TimePicker, theme } from "antd";
import ImageWF from "@/components/ImageWF";
import { useRouter } from "next/router";
import React, { useEffect, useState, memo, type ChangeEvent } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";
import {
  PhotoIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Loader } from "./Loader";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";

import Switch from "./Switch";
import { getDateTimeDiffString } from "@/helpers/time";
import { krotoCharge, paymentGatewayCharge } from "@/constants/values";
import CoursePricingInfoModal from "./CoursePricingInfoModal";

import { type BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

const titleLimit = 100;
const outcomeLimit = 100;

export const editCourseFormSchema = z.object({
  id: z.string().nonempty("Please enter course id"),
  thumbnail: z.string().nonempty("Please upload a cover"),
  title: z.string().max(titleLimit).nonempty("Please enter course title."),
  description: z
    .string()
    .max(3000)
    .nonempty("Please enter course description."),
  price: z.string().nonempty("Please enter course price."),
  permanentDiscount: z
    .string()
    .nonempty("Please enter course discounted price."),
  discount: z
    .object({
      price: z.string().nonempty("Please enter discount price."),
      deadline: z.date({ required_error: "Please enter discount deadline." }),
    })
    .optional(),
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  outcomes: z.array(
    z.string().max(outcomeLimit).nonempty("Please enter course outcome.")
  ),
  startsAt: z.date().optional(),
});

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

const CourseEditModal = () => {
  const ctx = api.useContext();
  const [courseInit, setCourseInit] = useState(false);

  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: course } = api.course.get.useQuery({
    id,
  });

  const { errorToast, warningToast } = useToast();

  const methods = useZodForm({
    schema: editCourseFormSchema,
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      price: "0",
      permanentDiscount: "0",
      tags: [],
      outcomes: [],
    },
  });

  const editor: BlockNoteEditor | null = useBlockNote({
    onEditorContentChange: (editor) => {
      void editor.blocksToMarkdown(editor.topLevelBlocks).then((md) => {
        methods.setValue("description", md);
      });
    },
    theme: "dark",
  });

  const { darkAlgorithm } = theme;

  const [tagInput, setTagInput] = useState("");
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [debouncedTagInput, setDebouncedTagInput] = useState(tagInput);

  const revalidate = useRevalidateSSG();
  const { data: searchedTags, isLoading: searchingtags } =
    api.tagsCourse.searchTags.useQuery(debouncedTagInput);

  const {
    mutateAsync: updateCourseMutation,
    isLoading: updateMutationLoading,
  } = api.course.update.useMutation();

  const [pricingInfo, setPricingInfo] = useState(false);

  const isDiscount =
    methods.watch()?.permanentDiscount !== null ||
    (methods.watch()?.discount &&
      (methods.watch()?.discount?.deadline ?? new Date())?.getTime() >
        new Date().getTime());

  const discount =
    methods.watch()?.discount &&
    (methods.watch()?.discount?.deadline ?? new Date()).getTime() >
      new Date().getTime()
      ? methods.watch()?.discount?.price ?? "0"
      : methods.watch()?.permanentDiscount ?? "0";

  const price = isDiscount
    ? parseInt(discount)
    : parseInt(methods.watch()?.price) ?? 0;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTagInput(tagInput);
    }, 500);

    return () => clearTimeout(timerId);
  }, [tagInput]);

  useEffect(() => {
    if (editor && course && !courseInit) {
      setCourseInit(true);
      methods.setValue("id", course?.id ?? "");
      methods.setValue("title", course?.title ?? "");
      methods.setValue("thumbnail", course?.thumbnail ?? "");
      methods.setValue("description", course?.description ?? "");
      const loadInitMdText = async () => {
        const blocks = await editor.markdownToBlocks(course?.description ?? "");
        if (blocks) editor.replaceBlocks(editor.topLevelBlocks, blocks);
      };
      void loadInitMdText();
      methods.setValue("price", course?.price.toString());
      methods.setValue(
        "permanentDiscount",
        (course?.permanentDiscount ?? 0).toString()
      );
      methods.setValue(
        "outcomes",
        (course?.outcomes as string[] | undefined) ?? []
      );
      methods.setValue("tags", course?.tags);
      methods.setValue(
        "discount",
        course?.discount
          ? { ...course?.discount, price: course?.discount?.price?.toString() }
          : undefined
      );
      methods.setValue("startsAt", course?.startsAt ?? undefined);
    }
  }, [course, courseInit, methods, editor]);

  if (!course) return <></>;

  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        await updateCourseMutation(values, {
          onSuccess: (courseUpdated) => {
            if (courseUpdated) {
              void ctx.course.get.invalidate();
              void revalidate(
                `/${courseUpdated?.creator?.creatorProfile ?? ""}`
              );
              void revalidate(
                `/${courseUpdated?.creator?.creatorProfile ?? ""}/course/${
                  courseUpdated?.id ?? ""
                }`
              );
            }
          },
          onError: () => {
            errorToast("Error in creating course!");
          },
        });
      })}
      className="mx-auto flex w-full flex-col gap-4"
    >
      <div className="relative mb-4 flex aspect-video w-full max-w-xs items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
        {methods.getValues("thumbnail") && (
          <ImageWF
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
          Course Title
        </label>
        <input
          value={methods.watch()?.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            methods.setValue("title", e.target?.value.substring(0, titleLimit));
          }}
          placeholder="Write course title..."
          className="w-full rounded-lg bg-neutral-800 px-3 py-1 font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500 sm:text-lg"
        />
        {
          <p className="text-end text-xs text-neutral-400">
            {methods.watch()?.title?.length}/{titleLimit}
          </p>
        }
        {methods.formState.errors.title?.message && (
          <p className="text-red-700">
            {methods.formState.errors.title?.message}
          </p>
        )}
      </div>

      {methods.watch()?.outcomes?.length > 0 ? (
        <div className="mb-4 flex w-full flex-col gap-3">
          <label htmlFor="outcomes" className="text-lg  text-neutral-200">
            What learners will learn from this course?
          </label>

          <div className="flex w-full flex-col items-start gap-3">
            {methods.watch().outcomes?.map((o, idx) => (
              <div className="flex w-full flex-col" key={`o-${idx}`}>
                <div className="flex w-full items-center gap-2">
                  <CheckIcon className="w-4" />
                  <input
                    value={o}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      methods.setValue(
                        `outcomes.${idx}`,
                        e.target?.value.substring(0, outcomeLimit)
                      );
                    }}
                    placeholder="Write a course outcome..."
                    className="w-full rounded-lg bg-neutral-800 px-3 py-1 text-sm font-medium text-neutral-200 outline outline-1 outline-neutral-700 transition-all duration-300 hover:outline-neutral-600 focus:outline-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      methods.setValue(
                        "outcomes",
                        methods.watch().outcomes?.filter((ou, id) => id !== idx)
                      );
                    }}
                  >
                    <TrashIcon className="w-4 text-red-500" />
                  </button>
                </div>
                {
                  <p className="mr-6 mt-1 text-end text-xs text-neutral-400">
                    {methods.watch()?.outcomes[idx]?.length}/{outcomeLimit}
                  </p>
                }
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                methods.setValue("outcomes", [...methods.watch().outcomes, ""]);
              }}
              className="flex items-center gap-1 rounded-lg border border-pink-600 bg-pink-600/10 px-3 py-1 text-sm font-bold text-pink-600"
            >
              <PlusIcon className="w-4" /> Add another
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex w-full flex-col items-start gap-2">
          <p>Describe what this course offers?</p>
          <button
            type="button"
            onClick={() => {
              methods.setValue("outcomes", [""]);
            }}
            className="flex items-center gap-1 rounded-lg border border-pink-600 bg-pink-600/10 px-3 py-1 font-bold text-pink-600"
          >
            <PlusIcon className="w-4" /> Add a course outcome
          </button>
        </div>
      )}

      <div
        className={`flex w-full items-center gap-2 ${
          methods.watch()?.startsAt ? "mb-1" : "mb-4"
        }`}
      >
        <p>Course starts in future?</p>

        <Switch
          value={!!methods.watch()?.startsAt}
          onClick={() => {
            if (methods.watch()?.startsAt)
              methods.setValue("startsAt", undefined);
            else
              methods.setValue(
                "startsAt",
                new Date(new Date().setDate(new Date().getDate() + 7))
              );
          }}
        />
      </div>

      {methods.watch()?.startsAt ? (
        <div className="mb-4 flex w-full flex-col items-start gap-1">
          <div className="flex w-full items-center gap-8">
            <label htmlFor="dDeadline" className="text-lg text-neutral-200">
              Course start date
            </label>
          </div>
          <div className="flex max-w-xs items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 p-2 sm:gap-3">
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
                  (methods.watch()?.startsAt ?? new Date())?.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  ),
                  "DD-MM-YYYY"
                )}
                onChange={(selectedDate) => {
                  methods.setValue("startsAt", selectedDate?.toDate());
                }}
              />
            </ConfigProvider>
            {/* <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" /> */}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col gap-3">
        <label htmlFor="description" className="text-lg  text-neutral-200">
          Description
        </label>
        <div data-color-mode="dark">
          {/* <MDEditor
            height={350}
            value={methods.watch()?.description}
            onChange={(mdtext) => {
              methods.setValue("description", mdtext ?? "");
            }}
          /> */}
          <BlockNoteView editor={editor} />
        </div>
        {methods.formState.errors.description?.message && (
          <p className="text-red-700">
            {methods.formState.errors.description?.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="tags" className="text-lg  text-neutral-200">
          Tags
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {methods.watch().tags.map((tag) => (
            <span
              className="flex items-center gap-1 overflow-hidden rounded bg-pink-600/30 pl-2 text-xs"
              key={tag.id}
            >
              {tag.title}{" "}
              <button
                onClick={() => {
                  methods.setValue(
                    "tags",
                    methods.watch().tags.filter((t) => t.id !== tag.id)
                  );
                }}
                type="button"
                className="ml-1 p-1 text-neutral-200 duration-150 hover:bg-pink-600"
              >
                <XMarkIcon className="w-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="relative flex w-full max-w-sm items-center justify-end">
          <input
            type="text"
            onFocus={() => setTagInputFocused(true)}
            onBlur={() =>
              setTimeout(() => {
                setTagInputFocused(false);
              }, 200)
            }
            value={tagInput}
            onChange={(e) => {
              setTagInput(e?.target?.value.substring(0, 30));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                methods.setValue("tags", [
                  ...methods.watch().tags,
                  {
                    id: tagInput,
                    title: tagInput,
                  },
                ]);
                setTagInput("");
              }
            }}
            className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1 pr-6 text-sm placeholder-neutral-500 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
            placeholder="Add tags..."
          />
          <div className="absolute">{searchingtags ? <Loader /> : <></>}</div>
        </div>
        {tagInputFocused && searchedTags && searchedTags?.length > 0 ? (
          <div
            className={`hide-scroll max-h-60 w-full max-w-sm overflow-y-auto`}
          >
            <div className="flex w-full flex-col overflow-hidden rounded border border-neutral-600 bg-neutral-800/70 backdrop-blur">
              {searchedTags?.map((st) => (
                <button
                  type="button"
                  className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                  onClick={() => {
                    setTagInput("");
                    if (!methods.watch().tags.find((tg) => tg.id === st.id))
                      methods.setValue("tags", [...methods.watch().tags, st]);
                  }}
                  key={st.id}
                >
                  {st.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {methods.formState.errors?.tags?.message && (
        <p className="text-red-700">
          {methods.formState.errors?.tags?.message}
        </p>
      )}

      <div className="flex items-start gap-4 sm:gap-8">
        <div className="mt-4 flex flex-col gap-3">
          <label htmlFor="price" className="text-lg  text-neutral-200">
            Price
          </label>
          <div className="relative flex w-full max-w-[7rem] items-center">
            <input
              type="number"
              {...methods.register("price")}
              className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="00"
              defaultValue={0}
            />
            <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
              ₹
            </p>
          </div>

          {methods.formState.errors?.price?.message && (
            <p className="text-red-700">
              {methods.formState.errors?.price?.message}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <label
            htmlFor="permanentDiscount"
            className="text-lg  text-neutral-200"
          >
            Discounted Price
          </label>

          <div className="relative flex w-full max-w-[7rem] items-center">
            <input
              type="number"
              {...methods.register("permanentDiscount")}
              className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="00"
              defaultValue={0}
            />
            <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
              ₹
            </p>
          </div>

          {methods.formState.errors?.price?.message && (
            <p className="text-red-700">
              {methods.formState.errors?.price?.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {methods.watch().discount ? (
            <>
              <label htmlFor="discount" className="text-lg text-neutral-200">
                Pre Sale
              </label>
              <button
                type="button"
                onClick={() => {
                  methods.setValue("discount", undefined);
                }}
                className="rounded-lg border border-pink-500 px-2 py-1 text-sm font-bold text-pink-500 duration-150 hover:border-pink-600 hover:text-pink-600"
              >
                Clear Pre-sale
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                methods.setValue("discount", {
                  price: "0",
                  deadline: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                  ),
                });
              }}
              className="flex items-center gap-1 rounded-lg border border-pink-500 px-2 py-1 text-sm font-bold text-pink-500 duration-150 hover:border-pink-600 hover:text-pink-600"
            >
              <PlusIcon className="w-4" /> Add a Pre-sale Price
            </button>
          )}
        </div>
        {methods.watch().discount ? (
          <>
            <label htmlFor="dPrice" className="text-sm text-neutral-200">
              Price
            </label>

            <div className="relative flex w-full max-w-[7rem] items-center">
              <input
                type="number"
                {...methods.register("discount.price")}
                className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="00"
                defaultValue={0}
              />
              <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
                ₹
              </p>
            </div>

            <label htmlFor="dDeadline" className="text-sm text-neutral-200">
              Deadline
            </label>
            <div className="flex max-w-xs items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 p-2 sm:gap-3">
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
                    methods
                      .watch()
                      ?.discount?.deadline?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }),
                    "DD-MM-YYYY"
                  )}
                  onChange={(selectedDate) => {
                    const sourceDateObj = selectedDate?.toDate() ?? new Date();
                    const targetDateObj =
                      methods.watch()?.discount?.deadline ?? new Date();
                    targetDateObj.setFullYear(sourceDateObj.getFullYear());
                    targetDateObj.setMonth(sourceDateObj.getMonth());
                    targetDateObj.setDate(sourceDateObj.getDate());
                    methods.setValue("discount.deadline", targetDateObj);
                  }}
                />
                <TimePicker
                  autoFocus={false}
                  bordered={false}
                  use12Hours
                  value={dayjs(
                    (
                      methods.watch()?.discount?.deadline ?? new Date()
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }),
                    "hh:mm A"
                  )}
                  onChange={(selectedTime) => {
                    if (selectedTime) {
                      const prvDate = new Date(
                        methods.watch()?.discount?.deadline ?? new Date()
                      );

                      prvDate.setHours(selectedTime.toDate().getHours());
                      prvDate.setMinutes(selectedTime.toDate().getMinutes());

                      methods.setValue("discount.deadline", prvDate);
                    }
                  }}
                  format="hh:mm A"
                  disabledTime={() => {
                    const now = dayjs();
                    return {
                      disabledHours: () => {
                        if (
                          dayjs(methods.watch()?.discount?.deadline).format(
                            "DD/MM/YYYY"
                          ) === dayjs(new Date()).format("DD/MM/YYYY")
                        )
                          return [...Array(now.hour()).keys()];
                        return [];
                      },
                      disabledMinutes: (selectedHour) => {
                        if (
                          dayjs(methods.watch()?.discount?.deadline).format(
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
                  style={{
                    color: "#fff",
                  }}
                />
              </ConfigProvider>
              {/* <BsCalendar3Event className="absolute ml-3 text-neutral-400 peer-focus:text-neutral-200" /> */}
            </div>
            <p className="text-sm text-yellow-600">
              <span className="font-bold">
                {getDateTimeDiffString(
                  new Date(),
                  methods.watch().discount?.deadline ?? new Date()
                )}
              </span>{" "}
              remaining on pre-sale price.
            </p>
            {methods.formState.errors.discount?.message && (
              <p className="text-red-700">
                {methods.formState.errors.discount?.message}
              </p>
            )}
            {methods.formState.errors.discount?.price?.message && (
              <p className="text-red-700">
                {methods.formState.errors.discount?.price?.message}
              </p>
            )}
            {methods.formState.errors.discount?.deadline?.message && (
              <p className="text-red-700">
                {methods.formState.errors.discount?.deadline?.message}
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      {price > 0 ? (
        <div className="w-full rounded-lg bg-neutral-700 p-4">
          <p className="text-sm">
            Course learners will have to pay ₹
            {price > 0 ? (price + paymentGatewayCharge * price).toFixed(2) : 0}{" "}
            & you will get ₹
            {price > 0 ? (price - krotoCharge * price).toFixed(2) : 0} .
          </p>

          <button
            type="button"
            onClick={() => setPricingInfo(true)}
            className="mt-4 text-sm underline"
          >
            How is this calculated?
          </button>
        </div>
      ) : (
        <></>
      )}

      <button
        className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center text-lg font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
        type="submit"
      >
        {updateMutationLoading ? <Loader white /> : <></>}
        Update Course
      </button>
      <CoursePricingInfoModal isOpen={pricingInfo} setIsOpen={setPricingInfo} />
    </form>
  );
};

export default memo(CourseEditModal);
