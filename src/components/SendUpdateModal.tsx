import { zodResolver } from "@hookform/resolvers/zod";
import React, { memo } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { Loader } from "./Loader";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const subjectLimit = 100;

const sendUpdateFormSchema = object({
  subject: string().max(subjectLimit).nonempty("Please enter event title."),
  body: string().max(3000).nonempty("Please enter event description."),
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

const SendUpdateModal = ({ eventId }: { eventId: string }) => {
  const methods = useZodForm({
    schema: sendUpdateFormSchema,
  });

  const { mutateAsync: sendUpdate, isLoading: sendingUpdate } =
    api.emailSender.sendUpdate.useMutation();

  const { mutateAsync: sendPreview, isLoading: sendingUpdatePreview } =
    api.emailSender.sendUpdatePreview.useMutation();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit(async (values) => {
        await sendUpdate({ ...values, eventId });
      })}
      className="mx-auto my-4 flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className="text-lg  text-neutral-200">
          Subject
        </label>
        <input
          {...methods.register("subject")}
          placeholder="Subject"
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium  text-neutral-200 outline outline-1 outline-neutral-600 transition-all duration-300 hover:outline-neutral-500 focus:outline-neutral-400 sm:text-lg"
        />
        {methods.formState.errors.subject?.message && (
          <p className="text-red-700">
            {methods.formState.errors.subject?.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="description" className="text-lg  text-neutral-200">
          Body
        </label>
        <div data-color-mode="dark">
          <MDEditor
            height={200}
            value={methods.watch()?.body}
            onChange={(mdtext) => {
              if (mdtext) methods.setValue("body", mdtext);
            }}
          />
        </div>
        {methods.formState.errors.body?.message && (
          <p className="text-red-700">
            {methods.formState.errors.body?.message}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col md:flex-row">
        <button
          className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
          type="submit"
        >
          {sendingUpdate && <Loader size="md" />}Send email update{" "}
          <PaperAirplaneIcon className="ml-1 w-5" />
        </button>
        <button
          onClick={async () => {
            await sendPreview({ ...methods.getValues() });
          }}
          className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl px-[1.5rem]  py-2  text-center font-medium text-neutral-200 transition-all duration-300 hover:underline disabled:text-neutral-300`}
          type="submit"
        >
          {sendingUpdatePreview && <Loader size="md" />} Send preview
        </button>
      </div>
    </form>
  );
};

export default memo(SendUpdateModal);
