/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { Loader } from "@/components/Loader";
import {
  PlusCircleIcon,
  PaperAirplaneIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import dynamic from "next/dynamic";
import ImageWF from "@/components/ImageWF";
import AnimatedSection from "@/components/AnimatedSection";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { type MDEditorProps } from "@uiw/react-md-editor";
import { Tooltip } from "antd";
import { type Email, type Recipient } from "@prisma/client";

const Marketing = () => {
  const { data: audienceData, isLoading: isAudienceLoading } =
    api.creator.audience.getAudienceMembers.useQuery();

  const {
    data: emailList,
    isLoading: emailListLoading,
    refetch: refetchEmails,
  } = api.email.getAll.useQuery();

  const [createEmailModal, setCreateEmail] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<
    | (Email & {
        recipients: Recipient[];
      })
    | null
  >(null);

  const { data: importedAudienceData, isLoading: isImpAudLoading } =
    api.creator.audience.getImportedAudience.useQuery();

  const { mutateAsync: createEmail, isLoading: createEmailLoader } =
    api.email.create.useMutation();

  const isLoading = isImpAudLoading || isAudienceLoading;

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="relative mt-10 px-4 lg:mt-0 lg:px-0" aria-hidden="true">
          <ImageWF
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
          <AnimatedSection className="mb-6 flex w-full items-start justify-between gap-2">
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
          </AnimatedSection>
          <AnimatedSection
            delay={0.2}
            className="mt-10 rounded-xl border border-neutral-900 bg-neutral-900/60 py-1 backdrop-blur"
          >
            <div className="divide-y divide-neutral-800">
              {emailList?.map((d) => (
                <div key={d.id} className="">
                  <div className="mx-5 my-2 flex justify-between rounded p-2 text-xl">
                    <p className="line-clamp-1 overflow-hidden text-ellipsis">
                      {d.subject}
                    </p>
                    <div className="flex gap-2">
                      <Tooltip title="Duplicate">
                        <button
                          className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-800`}
                          onClick={async () => {
                            await createEmail({
                              subject: d.subject,
                              body: d.body,
                            });
                            await refetchEmails();
                          }}
                        >
                          {createEmailLoader ? (
                            <Loader size="sm" />
                          ) : (
                            <DocumentDuplicateIcon className="w-3" />
                          )}
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <button
                          className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-800`}
                          onClick={() => {
                            setEditEmail(d);
                            setCreateEmail(true);
                          }}
                        >
                          <PencilIcon className="w-3" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="m-5 flex gap-2">
                    <button
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-400 hover:text-neutral-800`}
                    >
                      <PlusCircleIcon className="w-3" /> Add Recipients
                    </button>
                    <button
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-400 hover:text-neutral-800`}
                    >
                      <PaperAirplaneIcon className="w-3" /> Send
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <div
            className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
              createEmailModal ? "translate-x-0" : "translate-x-full"
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
            <CreateEmail editEmail={editEmail} setEditEmail={setEditEmail} />
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

export const CreateEmail = ({
  editEmail,
  setEditEmail,
}: {
  editEmail:
    | (Email & {
        recipients: Recipient[];
      })
    | null;
  setEditEmail: Dispatch<
    SetStateAction<(Email & { recipients: Recipient[] }) | null>
  >;
}) => {
  const ctx = api.useContext();
  const methods = useZodForm({
    schema: sendUpdateFormSchema,
  });

  const { mutateAsync: createEmail, isLoading: creatingEmail } =
    api.email.create.useMutation();

  const { mutateAsync: updateEmail, isLoading: updatingEmail } =
    api.email.update.useMutation();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit(async (values) => {
        if (editEmail) {
          await updateEmail(
            {
              subject: values.subject,
              body: values.body,
              emailUniqueId: editEmail.id,
            },
            {
              onSuccess: () => {
                void ctx.email.getAll.invalidate();
              },
            }
          );
          setEditEmail(null);
        } else {
          await createEmail(
            { ...values },
            {
              onSuccess: () => {
                void ctx.email.getAll.invalidate();
              },
            }
          ),
            methods.reset();
        }
      })}
      className="mx-auto my-4 flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className="text-lg  text-neutral-200">
          Subject
        </label>
        <input
          {...methods.register("subject")}
          defaultValue={editEmail?.subject ?? ""}
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
        <label htmlFor="body" className="text-lg  text-neutral-200">
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
        {editEmail ? (
          <button
            className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
            type="submit"
          >
            {updatingEmail && <Loader size="md" />}Update Email{""}
            <PlusCircleIcon className="ml-1 w-5" />
          </button>
        ) : (
          <button
            className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
            type="submit"
          >
            {creatingEmail && <Loader size="md" />}Create Email{""}
            <PlusCircleIcon className="ml-1 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default Marketing;

Marketing.getLayout = DashboardLayout;
