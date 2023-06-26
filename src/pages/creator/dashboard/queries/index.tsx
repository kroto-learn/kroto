import { DashboardLayout } from "..";
import React, { type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import AnimatedSection from "@/components/AnimatedSection";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { Loader } from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { type AskedQuery, type User } from "@prisma/client";
import { usePathname } from "next/navigation";

const Index = () => {
  const { data: session } = useSession();

  const { data: creator } = api.askedQuery.getAllCreatorProtected.useQuery({
    id: session?.user.id ?? "",
  });

  const { data: queries } = api.askedQuery.getAllCreator.useQuery({
    creatorProfile: creator?.creatorProfile ?? "",
  });

  const [createReplyModal, setCreateReply] = useState<boolean>(false);
  const [ReplyModal, setReplyModal] = useState<
    (AskedQuery & { user: User }) | undefined
  >();

  return (
    <>
      <Head>
        <title>Queries | Dashboard</title>
      </Head>
      <div className="flex w-full flex-col items-center py-8">
        {queries && queries.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
            {queries.map((query) => {
              return query.answer ? (
                <></>
              ) : (
                <div key={query?.id ?? ""}>
                  <div className="w-full -translate-y-6 rounded-lg bg-neutral-800 px-4 py-2 text-gray-300">
                    <div className="flex w-full">
                      <div>
                        <Image
                          className="rounded-full dark:border-gray-800"
                          src={query.user.image ?? ""}
                          width={30}
                          height={30}
                          alt={query?.user.name ?? ""}
                        />
                      </div>
                      <div className="w-full pl-3">
                        <p>{query.user.name}</p>
                        <p className="">{query.question}</p>
                      </div>
                    </div>
                    {query.answer ? (
                      <></>
                    ) : (
                      <div className="relative ">
                        <div className="absolute bottom-0 right-0">
                          <button
                            onClick={() => {
                              setCreateReply(true);
                              setReplyModal(query);
                            }}
                            className="text-sm font-semibold"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div
              className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
                createReplyModal ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <button
                onClick={() => {
                  setCreateReply(false);
                }}
                className="self-start rounded-xl border border-neutral-500 p-1 text-xl text-neutral-400"
              >
                <XMarkIcon className="w-5" />
              </button>
              <CreateReply
                ReplyModal={ReplyModal}
                setReplyModal={setReplyModal}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
            <div className="aspect-square object-contain">
              <FontAwesomeIcon
                icon={faCommentDots}
                fontSize={200}
                className="text-neutral-700"
              />
            </div>
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not wrote any Queries.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const answerLimit = 500;

const sendUpdateFormSchema = object({
  answer: string().max(answerLimit).nonempty("Please reply their question"),
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

export const CreateReply = ({
  ReplyModal,
}: {
  ReplyModal: (AskedQuery & { user: User }) | undefined;
  setReplyModal: Dispatch<
    SetStateAction<(AskedQuery & { user: User }) | undefined>
  >;
}) => {
  const ctx = api.useContext();
  const methods = useZodForm({
    schema: sendUpdateFormSchema,
  });

  // const { mutateAsync: createEmail, isLoading: creatingEmail } =
  //   api.askedQuery.create.useMutation();

  const { mutateAsync: createAnswer, isLoading: createAnswerLoading } =
    api.askedQuery.update.useMutation();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit(async (values) => {
        if (ReplyModal) {
          await createAnswer(
            {
              ...values,
              id: ReplyModal.id,
            },
            {
              onSuccess: () => {
                void ctx.askedQuery.getAllUser.invalidate();
                methods.setValue("answer", "");
              },
            }
          );
        }
      })}
      className="mx-auto my-4 flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex w-full">
        <div>
          <Image
            className="rounded-full dark:border-gray-800"
            src={ReplyModal?.user.image ?? ""}
            width={30}
            height={30}
            alt={ReplyModal?.user.name ?? ""}
          />
        </div>
        <div className="w-full pl-3">
          <p className="text-sm font-bold">{ReplyModal?.user.name}</p>
          <p className="">{ReplyModal?.question}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <textarea
            rows={6}
            className="mt-6 w-full rounded-xl border-0 bg-neutral-700 p-4 outline-0 placeholder:text-neutral-400"
            value={methods.watch()?.answer}
            onChange={(e) => {
              if (e)
                methods.setValue(
                  "answer",
                  e.target?.value.substring(0, answerLimit)
                );
            }}
          />
        </div>
        {methods.formState.errors.answer?.message && (
          <p className="text-red-700">
            {methods.formState.errors.answer?.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col md:flex-row">
        <button
          className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2 text-center text-lg  font-bold text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
          type="submit"
        >
          Send
          {createAnswerLoading ? (
            <Loader size="md" />
          ) : (
            <PaperAirplaneIcon className="ml-1 w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const QueriesNestedLayout = nestLayout(DashboardLayout, QueriesLayout);

export default Index;

Index.getLayout = QueriesNestedLayout;

function QueriesLayoutR({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <AnimatedSection
        delay={0.1}
        className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
      >
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href="/creator/dashboard/queries"
              className={`inline-block rounded-t-lg p-4 ${
                pathname === "/creator/dashboard/queries"
                  ? "border-b-2 border-pink-500 text-pink-500 transition"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
            >
              Not Replied
            </Link>
          </li>
          <li className="/creator/dashboard/queries">
            <Link
              href="/creator/dashboard/queries/replied"
              className={`inline-block rounded-t-lg p-4 transition ${
                pathname === "/creator/dashboard/queries/replied"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
              aria-current="page"
            >
              Replied
            </Link>
          </li>
        </ul>
      </AnimatedSection>
      {children}
    </div>
  );
}

function QueriesLayout(page: ReactNode) {
  return <QueriesLayoutR>{page}</QueriesLayoutR>;
}

export { QueriesLayout };
