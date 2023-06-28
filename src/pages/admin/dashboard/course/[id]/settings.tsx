import Head from "next/head";
import { useRouter } from "next/router";
import React, {
  useState,
  type Dispatch,
  Fragment,
  type SetStateAction,
  useEffect,
} from "react";
import { CourseNestedLayout } from ".";
import { api } from "@/utils/api";
import {
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import AnimatedSection from "@/components/AnimatedSection";
import { Transition, Dialog, Listbox } from "@headlessui/react";
import { Loader } from "@/components/Loader";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import useToast from "@/hooks/useToast";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MixPannelClient } from "@/analytics/mixpanel";
import { ConfigProvider, DatePicker, TimePicker, theme } from "antd";
import dayjs from "dayjs";
import { getDateTimeDiffString } from "@/helpers/time";

export const settingsFormSchema = z.object({
  price: z.string().nonempty("Please enter course price."),
  discount: z
    .object({
      price: z.string().nonempty("Please enter discount price."),
      deadline: z.date({ required_error: "Please enter discount deadline." }),
    })
    .optional(),
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  category: z.object({ id: z.string(), title: z.string() }).optional(),
  id: z.string(),
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

const Index = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const methods = useZodForm({
    schema: settingsFormSchema,
    defaultValues: {
      price: "0",
      tags: [],
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [debouncedTagInput, setDebouncedTagInput] = useState(tagInput);

  const { mutateAsync: courseUpdateMutation, isLoading: priceMutateLoading } =
    api.course.update.useMutation();

  const { data: searchedTags, isLoading: searchingtags } =
    api.tagsCourse.searchTags.useQuery(debouncedTagInput);

  const { data: catgs } = api.categoriesCourse.getCategories.useQuery();

  const [initData, setInitData] = useState(false);

  const ctx = api.useContext();

  const revalidate = useRevalidateSSG();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTagInput(tagInput);
    }, 500);

    return () => clearTimeout(timerId);
  }, [tagInput]);

  useEffect(() => {
    if (!(course instanceof TRPCError) && course && !initData) {
      setInitData(true);
      methods.setValue("price", course?.price?.toString());
      methods.setValue(
        "discount",
        course?.discount
          ? { ...course?.discount, price: course?.discount?.price?.toString() }
          : undefined
      );
      methods.setValue("tags", course?.tags);
      methods.setValue("category", course?.category ?? undefined);
      methods.setValue("id", course?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const { darkAlgorithm } = theme;

  if (courseLoading) return <></>;

  if (course instanceof TRPCError || !course) return <>Not Found</>;

  return (
    <>
      <Head>
        <title>{(course?.title ?? "Course") + " | Settings"}</title>
      </Head>
      <AnimatedSection
        delay={0.2}
        className="w-full rounded-xl bg-neutral-900 p-8"
      >
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            await courseUpdateMutation(values, {
              onSuccess: () => {
                MixPannelClient.getInstance().courseUpdated({
                  courseId: course?.id,
                });
                void ctx.course.get.invalidate();
                void ctx.course.getCourse.invalidate();
                void revalidate(`/course/${course?.id}`);
                if (course?.creator)
                  void revalidate(`/${course?.creator?.creatorProfile ?? ""}`);
              },
            });
          })}
          className="mb-12 mt-1 flex flex-col items-start gap-3"
        >
          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="price" className="text-lg  text-neutral-200">
              Price
            </label>
            <div className="flex items-center gap-2">
              <div
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                  methods.watch().price === "0"
                    ? "border-green-600 bg-green-600/40"
                    : "border-neutral-500 text-neutral-500"
                }`}
                onClick={() => {
                  methods.setValue("price", "0");
                }}
              >
                <div
                  className={`flex h-3 w-3 items-center rounded-full border ${
                    methods.watch().price === "0"
                      ? "border-neutral-300"
                      : "border-neutral-500"
                  }`}
                >
                  {methods.watch().price === "0" ? (
                    <div className="h-full w-full rounded-full bg-neutral-300" />
                  ) : (
                    <></>
                  )}
                </div>{" "}
                Free
              </div>

              <div
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                  methods.watch().price !== "0"
                    ? "border-pink-600 bg-pink-600/40"
                    : "border-neutral-500 text-neutral-500"
                }`}
                onClick={() => {
                  methods.setValue("price", "50");
                }}
              >
                <div
                  className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                    methods.watch().price !== "0"
                      ? "border-neutral-300"
                      : "border-neutral-500"
                  }`}
                >
                  {methods.watch().price !== "0" ? (
                    <div className="h-full w-full rounded-full bg-neutral-300" />
                  ) : (
                    <></>
                  )}
                </div>{" "}
                Paid
              </div>
            </div>
            {methods.watch().price !== "0" ? (
              <div className="relative flex w-full max-w-[7rem] items-center">
                <input
                  type="number"
                  {...methods.register("price")}
                  className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="00"
                  defaultValue={50}
                />
                <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
                  ₹
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              {methods.watch().discount ? (
                <>
                  <label
                    htmlFor="discount"
                    className="text-lg text-neutral-200"
                  >
                    Discount
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      methods.setValue("discount", undefined);
                    }}
                    className="rounded-lg border border-pink-500 px-2 py-1 text-sm font-bold text-pink-500 duration-150 hover:border-pink-600 hover:text-pink-600"
                  >
                    Clear Discount
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
                  <PlusIcon className="w-4" /> Add a Discount
                </button>
              )}
            </div>
            {methods.watch().discount ? (
              <>
                <label htmlFor="dPrice" className="text-sm text-neutral-200">
                  Discounted Price
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                      methods.watch().discount?.price === "0"
                        ? "border-green-600 bg-green-600/40"
                        : "border-neutral-500 text-neutral-500"
                    }`}
                    onClick={() => {
                      methods.setValue("discount.price", "0");
                    }}
                  >
                    <div
                      className={`flex h-3 w-3 items-center rounded-full border ${
                        methods.watch().discount?.price === "0"
                          ? "border-neutral-300"
                          : "border-neutral-500"
                      }`}
                    >
                      {methods.watch().discount?.price === "0" ? (
                        <div className="h-full w-full rounded-full bg-neutral-300" />
                      ) : (
                        <></>
                      )}
                    </div>{" "}
                    Free
                  </div>

                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                      methods.watch().discount?.price !== "0"
                        ? "border-pink-600 bg-pink-600/40"
                        : "border-neutral-500 text-neutral-500"
                    }`}
                    onClick={() => {
                      methods.setValue("discount.price", "50");
                    }}
                  >
                    <div
                      className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                        methods.watch().discount?.price !== "0"
                          ? "border-neutral-300"
                          : "border-neutral-500"
                      }`}
                    >
                      {methods.watch().discount?.price !== "0" ? (
                        <div className="h-full w-full rounded-full bg-neutral-300" />
                      ) : (
                        <></>
                      )}
                    </div>{" "}
                    Paid
                  </div>
                </div>
                {methods.watch().discount?.price !== "0" ? (
                  <div className="relative flex w-full max-w-[7rem] items-center">
                    <input
                      type="number"
                      {...methods.register("discount.price")}
                      className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="00"
                      defaultValue={50}
                    />
                    <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
                      ₹
                    </p>
                  </div>
                ) : (
                  <></>
                )}
                <label htmlFor="dDeadline" className="text-sm text-neutral-200">
                  Discount Deadline
                </label>
                <div className="flex max-w-xs items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 p-2">
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
                        const sourceDateObj =
                          selectedDate?.toDate() ?? new Date();
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
                          prvDate.setMinutes(
                            selectedTime.toDate().getMinutes()
                          );

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
                </div>
                <p className="text-sm text-yellow-600">
                  <span className="font-bold">
                    {getDateTimeDiffString(
                      new Date(),
                      methods.watch().discount?.deadline ?? new Date()
                    )}
                  </span>{" "}
                  remaining for discount.
                </p>
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
              <div className="absolute">
                {searchingtags ? <Loader /> : <></>}
              </div>
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
                          methods.setValue("tags", [
                            ...methods.watch().tags,
                            st,
                          ]);
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

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="category" className="text-lg  text-neutral-200">
              Category
            </label>
            <div className="relative flex w-full max-w-sm items-center justify-end">
              <Listbox
                value={methods.watch().category?.id ?? "none"}
                onChange={(val) => {
                  const selectedCatg = catgs?.find((ctg) => ctg.id === val);
                  if (selectedCatg) methods.setValue("category", selectedCatg);
                  else methods.setValue("category", undefined);
                }}
              >
                {({ open }) => (
                  <div className="flex w-full flex-col gap-2">
                    <div className="relative flex w-full items-center justify-end">
                      <Listbox.Button className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-8 text-left">
                        {methods.watch().category?.title ?? "none"}
                      </Listbox.Button>
                      <ChevronDownIcon
                        className={`${
                          open ? "rotate-180 duration-150" : ""
                        } absolute mr-4 w-4`}
                      />
                    </div>
                    <div
                      className={`hide-scroll max-h-60 w-full max-w-sm overflow-y-auto`}
                    >
                      <Listbox.Options className="flex w-full flex-col overflow-hidden rounded border border-neutral-600 bg-neutral-800/70 backdrop-blur">
                        <Listbox.Option
                          key={"none"}
                          value={"none"}
                          className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                        >
                          none
                        </Listbox.Option>
                        {catgs && catgs.length > 0 ? (
                          catgs.map((ctg) => (
                            <Listbox.Option
                              key={ctg.id}
                              value={ctg.id}
                              className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                            >
                              {ctg.title}
                            </Listbox.Option>
                          ))
                        ) : (
                          <></>
                        )}
                      </Listbox.Options>
                    </div>
                  </div>
                )}
              </Listbox>
            </div>
          </div>

          <button className="flex items-center gap-1 rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold duration-150 hover:bg-pink-600">
            {priceMutateLoading ? <Loader white /> : <></>} Update Course
          </button>
        </form>
        <div className="flex flex-col items-start gap-3">
          <label className="text-lg font-medium">
            Delete &quot;{course?.title ?? ""}&quot; course ?
          </label>
          <button
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            <TrashIcon className="w-3" />
            Delete Course
          </button>
        </div>
      </AnimatedSection>

      <DeleteCourseModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        courseTitle={course?.title ?? ""}
        courseId={course?.id ?? ""}
        creatorProfile={course?.creator?.creatorProfile ?? ""}
      />
    </>
  );
};

export function DeleteCourseModal({
  isOpen,
  setIsOpen,
  courseTitle,
  courseId,
  creatorProfile,
}: {
  courseTitle: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string;
  creatorProfile: string;
}) {
  const { mutateAsync: deleteCourseMutation, isLoading } =
    api.course.delete.useMutation();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const ctx = api.useContext();
  const revalidate = useRevalidateSSG();
  const { errorToast } = useToast();

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
                        Delete Course
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
                  <div className="space-y-6 p-4">
                    <p className="text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Are you sure you want to delete the{" "}
                      <span className="font-medium">
                        &quot;{courseTitle}
                        &quot;
                      </span>{" "}
                      course?
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteCourseMutation(
                            { id },
                            {
                              onSuccess: () => {
                                MixPannelClient.getInstance().courseDeleted({
                                  courseId,
                                });
                                void ctx.course.getAllAdmin.invalidate();
                                void ctx.course.get.invalidate();
                                const cid = courseId;
                                void revalidate(`/course/${cid}`);
                                if (creatorProfile && creatorProfile !== "")
                                  void revalidate(`/${creatorProfile}`);

                                void router.replace("/admin/dashboard/courses");
                              },
                              onError: () => {
                                errorToast("Error in deleting course!");
                              },
                            }
                          );
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-red-500 hover:text-neutral-200"
                    >
                      {isLoading ? <Loader /> : <></>} Delete Course
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
}

export default Index;

Index.getLayout = CourseNestedLayout;
