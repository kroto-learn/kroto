/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import React, { useState } from "react";
import { Loader } from "@/components/Loader";
import {
  PlusCircleIcon,
  PencilIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";

const Marketing = () => {
  const { data: audienceData, isLoading: isAudienceLoading } =
    api.creator.audience.getAudienceMembers.useQuery();

  const { data: emailList, isLoading: emailListLoading } =
    api.email.getAll.useQuery();

  const [createEmail, setCreateEmail] = useState<boolean>(false);

  const { data: importedAudienceData, isLoading: isImpAudLoading } =
    api.creator.audience.getImportedAudience.useQuery();

  const isLoading = isImpAudLoading || isAudienceLoading;

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="relative mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <Image
            src="/landing/newsletter.png"
            alt="Newsletter"
            className="grayscale filter"
            width={500}
            height={500}
          />
        </div>
        <h1 className="text-3xl text-neutral-400">Coming soon...</h1>
      </div>
    );
  }

  if (isLoading || emailListLoading)
    return (
      <>
        <Head>
          <title>Audience | Dashboard</title>
        </Head>
        <div className="my-12 flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Audience | Dashboard</title>
      </Head>
      <div className="flex flex-col">
        <div className="mx-2 my-8 min-h-[80%] w-full px-6">
          <div className="mb-6 flex w-full items-start justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl text-neutral-200">
                {audienceData?.length ??
                  0 + (importedAudienceData?.length ?? 0) ??
                  "-"}
              </p>
              <h3 className="mb-4 text-xl font-medium">Audience members</h3>
            </div>
            <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                onClick={() => setCreateEmail(true)}
                type="button"
                className="mb-2 mr-2 flex items-center gap-2 rounded-lg border border-pink-500 px-4 py-2 text-center text-sm font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400 disabled:opacity-50 disabled:hover:border-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              >
                <PlusCircleIcon className="h-4" /> Create Email
              </button>
            </div>
          </div>
          <div className="mt-10 rounded-xl bg-neutral-900 py-1">
            <div className="divide-y divide-neutral-800">
              {emailList?.map((d) => (
                <div key={d.id} className="">
                  <div className="mx-2 my-2 rounded p-2 text-lg">
                    <p>{d.subject}</p>
                  </div>
                  <div className="mb-4 flex flex-row-reverse gap-2 px-5">
                    <button
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-400 hover:text-neutral-800`}
                    >
                      <DocumentDuplicateIcon className="w-3" /> Duplicate
                    </button>
                    <button
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-400 hover:text-neutral-800`}
                    >
                      <PaperAirplaneIcon className="w-3" /> Send
                    </button>
                    <button
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-400 hover:text-neutral-800`}
                    >
                      <PencilIcon className="w-3" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
              createEmail ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              onClick={() => {
                setCreateEmail(false);
              }}
              className="self-start rounded-xl border border-neutral-500 p-1 text-xl text-neutral-400"
            >
              <XMarkIcon className="w-5" />
            </button>
            <CreateEmail />
          </div>
        </div>
      </div>
    </>
  );
};

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

export const CreateEmail = () => {
  const ctx = api.useContext();
  const methods = useZodForm({
    schema: sendUpdateFormSchema,
  });

  const { mutateAsync: createEmail, isLoading: creatingEmail } =
    api.email.create.useMutation();

  // const { mutateAsync: sendPreview, isLoading: sendingUpdatePreview } =
  //   api.emailSender.sendUpdatePreview.useMutation();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit(async (values) => {
        await createEmail(
          { ...values },
          {
            onSuccess: () => {
              void ctx.email.getAll.invalidate();
            },
          }
        );
        methods.reset();
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
          {creatingEmail && <Loader size="md" />}Create Email{" "}
          <PlusCircleIcon className="ml-1 w-5" />
        </button>
        {/* <button
          onClick={async () => {
            // await sendPreview({ ...methods.getValues() });
          }}
          className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl px-[1.5rem]  py-2  text-center font-medium text-neutral-200 transition-all duration-300 hover:underline disabled:text-neutral-300`}
          type="submit"
        >
          Send preview
        </button> */}
      </div>
    </form>
  );
};

export default Marketing;

Marketing.getLayout = DashboardLayout;
