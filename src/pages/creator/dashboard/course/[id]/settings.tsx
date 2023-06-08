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
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import AnimatedSection from "@/components/AnimatedSection";
import { Transition, Dialog } from "@headlessui/react";
import { Loader } from "@/components/Loader";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import useToast from "@/hooks/useToast";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const settingsFormSchema = z.object({
  price: z.string().nonempty("Please enter course price."),
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
    },
  });

  const { mutateAsync: priceUpdateMutation, isLoading: priceMutateLoading } =
    api.course.updatePrice.useMutation();

  const [initPrice, setInitPrice] = useState(false);

  const ctx = api.useContext();

  const revalidate = useRevalidateSSG();

  useEffect(() => {
    if (!(course instanceof TRPCError) && course && !initPrice) {
      setInitPrice(true);
      methods.setValue("price", course?.price?.toString());
      methods.setValue("id", course?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

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
            await priceUpdateMutation(values, {
              onSuccess: () => {
                void ctx.course.get.invalidate();
                void ctx.course.getCourse.invalidate();
                void revalidate(`/course/${course?.id}`);
                void revalidate(`/${course?.creator?.creatorProfile ?? ""}`);
              },
            });
          })}
          className="mb-12 mt-1 flex flex-col items-start gap-3"
        >
          <label htmlFor="description" className="text-lg  text-neutral-200">
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
          <button className="flex items-center gap-1 rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold duration-150 hover:bg-pink-600">
            {priceMutateLoading ? <Loader white /> : <></>} Update Price
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
                                const fxn = async () => {
                                  await ctx.course.getAll.invalidate();
                                  await ctx.course.get.invalidate();
                                  await revalidate(`/course/${courseId}`);
                                  await revalidate(`/${creatorProfile}`);

                                  void router.replace(
                                    "/creator/dashboard/courses"
                                  );
                                };

                                void fxn();
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
