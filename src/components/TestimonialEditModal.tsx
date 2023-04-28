import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { memo } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { Loader } from "./Loader";
import { type Testimonial } from "@prisma/client";

const contentLimit = 500;

const testimonialFormSchema = object({
  content: string().max(contentLimit).nonempty("Please enter feedback."),
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

type Props = {
  testimonial: Testimonial;
  setModalOpen: (value: null) => void;
};

const EventEditModal = ({ testimonial, setModalOpen }: Props) => {
  const { errorToast, successToast } = useToast();

  const ctx = api.useContext();

  const methods = useZodForm({
    schema: testimonialFormSchema,
    defaultValues: {
      content: testimonial?.content ?? "",
    },
  });

  const { data: creator } = api.creator.getPublicProfile.useQuery({
    creatorProfile: testimonial.creatorProfile,
  });

  const {
    mutateAsync: updateTestimonialMutation,
    isLoading: updateTestimonialLoading,
  } = api.testimonial.update.useMutation();

  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        await updateTestimonialMutation(
          {
            ...values,
            id: testimonial?.id ?? "",
          },
          {
            onSuccess: () => {
              successToast("Testimonial update successfully");
              void ctx.testimonial.getAllUser.invalidate();
              setModalOpen(null);
            },
            onError: () => {
              errorToast("Error in updating testimonial");
            },
          }
        );
      })}
      className="my-8 flex w-full max-w-2xl flex-col items-center gap-2 overflow-hidden p-2 px-2 md:items-start md:px-4"
    >
      <div className="flex items-center justify-center gap-2 text-lg md:text-xl lg:justify-start lg:text-2xl">
        <span>Write a testimonial for</span>
        <Image
          src={creator?.image ?? ""}
          width={30}
          height={30}
          alt={creator?.name ?? ""}
          className="rounded-full"
        />
        <span className="font-medium">{creator?.name ?? ""}</span>
      </div>

      <textarea
        value={methods.watch()?.content}
        onChange={(e) => {
          methods.setValue(
            "content",
            e.target?.value.substring(0, contentLimit)
          );
        }}
        rows={6}
        className="mt-6 w-full rounded-xl border-0 bg-neutral-700 p-4 outline-0 placeholder:text-neutral-400"
        placeholder="Write me a testimonial..."
      />
      {
        <p className="w-full text-end text-neutral-600">
          {methods.watch()?.content?.length}/{contentLimit}
        </p>
      }
      {methods.formState.errors.content?.message && (
        <p className="text-red-700">
          {methods.formState.errors.content?.message}
        </p>
      )}
      <button
        type="submit"
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-lg font-medium text-neutral-200 outline-0 duration-150 hover:bg-pink-700"
      >
        Update
        {updateTestimonialLoading ? (
          <Loader white />
        ) : (
          <PaperAirplaneIcon className="w-5 transition-transform duration-150 group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
};

export default memo(EventEditModal);
