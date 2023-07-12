import { Loader } from "@/components/Loader";
import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import {
  ArrowSmallRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { number, object, string, type z } from "zod";

const commentLimit = 500;

const feedbackFormSchema = object({
  comment: string().max(commentLimit).nonempty("Please enter feedback."),
  rating: number().min(1, "Rating can't be left empty!").max(5),
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
  const { data: course, isLoading: courseLoading } =
    api.course.getCourse.useQuery({
      id,
    });

  const methods = useZodForm({
    schema: feedbackFormSchema,
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const session = useSession();

  const { mutateAsync: addFeedbackMutation, isLoading: addFeedbackLoading } =
    api.courseFeedback.addFeedback.useMutation();

  const ctx = api.useContext();

  const { successToast, errorToast, warningToast } = useToast();

  const { data: feedback, isLoading: feedbackLoading } =
    api.courseFeedback.getFeedback.useQuery({
      courseId: id,
      userId: session.data?.user?.id ?? "",
    });

  const feedbackExists = !!feedback;

  const isLoading =
    session.status === "loading" || courseLoading || feedbackLoading;

  if (!course) return <>Course not found!</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {isLoading ? (
        <Loader size="lg" />
      ) : feedbackExists ? (
        <div className="flex w-full max-w-3xl flex-col items-center gap-2">
          <h1 className="text-2xl md:text-3xl">
            {"🙏"} Thank you for your feedback!
          </h1>
          <Link
            className="text-medium group mt-8 flex items-center text-xl text-pink-500"
            href={`${
              course?.creator
                ? `/${course?.creator?.creatorProfile ?? ""}`
                : `https://www.youtube.com/${course?.ytChannelId ?? ""}`
            }`}
            target={!course?.creator ? "_blank" : undefined}
          >
            See more courses and events by{" "}
            {course?.creator?.name ?? course?.ytChannelName ?? ""}{" "}
            <ArrowSmallRightIcon className="ml-2 w-8 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            if (course?.creatorId === session.data?.user?.id) {
              warningToast("You can't give feedback for your own course");
              return;
            }
            await addFeedbackMutation(
              {
                ...values,
                courseId: id,
              },
              {
                onSuccess: () => {
                  successToast("Feedback submitted successfully");
                  void ctx.courseFeedback.getFeedback.invalidate();
                },
                onError: () => {
                  errorToast("Error in submitting feedback");
                },
              }
            );
          })}
          className="my-8 flex w-full max-w-3xl flex-col items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-l from-neutral-900 to-neutral-800 p-6 px-4 md:items-start md:p-10 md:px-12"
        >
          <h1 className="text-center text-xl md:text-2xl lg:text-left lg:text-3xl">
            Feedback for the{" "}
            <span className="font-medium">{course?.title ?? ""}</span> course
          </h1>
          <h3 className="mb-4 mt-8 text-lg md:text-xl">Rate your experience</h3>
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <button
              type="button"
              onClick={() => methods.setValue("rating", 1)}
              className={`aspect-square cursor-pointer rounded-full border-2 p-1 text-xl duration-150 sm:text-3xl md:text-4xl lg:text-5xl ${
                methods.watch().rating !== 1
                  ? "border-neutral-700 bg-neutral-800 grayscale"
                  : "border-2 border-pink-600 bg-pink-600/20 grayscale-0"
              } hover:scale-110 hover:grayscale-0 active:scale-100`}
            >
              {"😠"}
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("rating", 2)}
              className={`aspect-square cursor-pointer rounded-full border-2 p-1 text-xl duration-150 sm:text-3xl md:text-4xl lg:text-5xl ${
                methods.watch().rating !== 2
                  ? "border-neutral-700 bg-neutral-800 grayscale"
                  : "border-2 border-pink-600 bg-pink-600/20 grayscale-0"
              } hover:scale-110 hover:grayscale-0 active:scale-100`}
            >
              {"😔"}
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("rating", 3)}
              className={`aspect-square cursor-pointer rounded-full border-2 p-1 text-xl duration-150 sm:text-3xl md:text-4xl lg:text-5xl ${
                methods.watch().rating !== 3
                  ? "border-neutral-700 bg-neutral-800 grayscale"
                  : "border-2 border-pink-600 bg-pink-600/20 grayscale-0"
              } hover:scale-110 hover:grayscale-0 active:scale-100`}
            >
              {"😑"}
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("rating", 4)}
              className={`aspect-square cursor-pointer rounded-full border-2 p-1 text-xl duration-150 sm:text-3xl md:text-4xl lg:text-5xl ${
                methods.watch().rating !== 4
                  ? "border-neutral-700 bg-neutral-800 grayscale"
                  : "border-2 border-pink-600 bg-pink-600/20 grayscale-0"
              } hover:scale-110 hover:grayscale-0 active:scale-100`}
            >
              {"😄"}
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("rating", 5)}
              className={`aspect-square cursor-pointer rounded-full border-2 p-1 text-xl duration-150 sm:text-3xl md:text-4xl lg:text-5xl ${
                methods.watch().rating !== 5
                  ? "border-neutral-700 bg-neutral-800 grayscale"
                  : "border-2 border-pink-600 bg-pink-600/20 grayscale-0"
              } hover:scale-110 hover:grayscale-0 active:scale-100`}
            >
              {"🤩"}
            </button>
          </div>
          {methods.formState.errors.rating?.message && (
            <p className="text-red-700">
              {methods.formState.errors.rating?.message}
            </p>
          )}
          <textarea
            // {...methods.register("comment")}
            value={methods.watch()?.comment}
            onChange={(e) => {
              methods.setValue(
                "comment",
                e.target?.value.substring(0, commentLimit)
              );
            }}
            rows={4}
            className="mt-6 w-full rounded-xl border-0 bg-neutral-700 p-4 outline-0 placeholder:text-neutral-400"
            placeholder="Tell us what you think we can improve on..."
          />
          {
            <p className="w-full text-end text-neutral-600">
              {methods.watch()?.comment?.length}/{commentLimit}
            </p>
          }
          {methods.formState.errors.comment?.message && (
            <p className="text-red-700">
              {methods.formState.errors.comment?.message}
            </p>
          )}
          <button
            type="submit"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-lg font-medium text-neutral-200 outline-0 duration-150 hover:bg-pink-700"
          >
            Submit
            {addFeedbackLoading ? (
              <Loader white />
            ) : (
              <PaperAirplaneIcon className="w-5 transition-transform duration-150 group-hover:translate-x-1" />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Index;
