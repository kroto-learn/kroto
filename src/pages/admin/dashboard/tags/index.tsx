import Head from "next/head";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { AdminDashboardLayout } from "..";
import { z } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/hooks/useToast";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { type Tag } from "@prisma/client";

export const createTagFormSchema = z.object({
  title: z.string().min(3).nonempty("Please enter tag title."),
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
  const methods = useZodForm({
    schema: createTagFormSchema,
  });

  const { successToast, errorToast } = useToast();

  const [tagInput, setTagInput] = useState("");
  const [debouncedTagInput, setDebouncedTagInput] = useState(tagInput);

  const { data: tags, isLoading: tagsLoading } =
    api.tagsCourse.searchTags.useQuery(debouncedTagInput);

  const [tagsState, setTagsState] = useState<Tag[]>([]);

  const { mutateAsync: createTagMutation, isLoading: createTagLoading } =
    api.tagsCourse.createTag.useMutation();

  const { mutateAsync: deleteTagMutation } =
    api.tagsCourse.deleteTag.useMutation();

  const ctx = api.useContext();

  useEffect(() => {
    if (tags) setTagsState(tags);
  }, [tags]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTagInput(tagInput);
    }, 500);

    return () => clearTimeout(timerId);
  }, [tagInput]);

  return (
    <>
      <Head>
        <title>Tags | Admin</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection className="flex w-full flex-col items-start gap-2">
          <h1 className="text-2xl text-neutral-200">Tags</h1>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e?.target?.value.substring(0, 30));
            }}
            className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1 pr-6 text-sm placeholder-neutral-500 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
            placeholder="Search tags..."
          />
        </AnimatedSection>
        {tagsLoading ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : !(tags instanceof TRPCError) && tags && tags.length > 0 ? (
          <AnimatedSection
            delay={0.2}
            className="flex max-h-[70vh] w-full flex-col items-start gap-4 overflow-y-auto"
          >
            {tagsState?.map((tag) => (
              <li
                key={tag?.id}
                className="flex w-full items-center justify-between"
              >
                {tag?.title}
                <button
                  onClick={() => {
                    void deleteTagMutation(tag.id, {
                      onSuccess: () => {
                        void ctx.tagsCourse.searchTags.invalidate();
                      },
                    });
                    setTagsState(tagsState.filter((tg) => tg.id !== tag.id));
                  }}
                >
                  <TrashIcon className="w-4 text-red-500" />
                </button>
              </li>
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection
            delay={0.2}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 text-center"
          >
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not created any tags yet.
            </p>
          </AnimatedSection>
        )}
        <AnimatedSection className="w-full" delay={0.3}>
          <form
            onSubmit={methods.handleSubmit(async (values) => {
              await createTagMutation(values.title, {
                onSuccess: (tag) => {
                  if (tag && !(tag instanceof TRPCError)) {
                    successToast(`New tag ${tag.title} created.`);
                  }
                  methods.setValue("title", "");
                  void ctx.tagsCourse.searchTags.invalidate();
                },
                onError: () => {
                  errorToast("Error in creating tag!");
                },
              });
            })}
            className="flex w-full flex-col gap-2"
          >
            <div className="flex w-full items-center gap-4">
              <input
                placeholder="New tag title..."
                {...methods.register("title")}
                className="w-full max-w-sm rounded-lg bg-pink-500/10 px-3 py-2 font-medium text-neutral-200 outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
              />
              <button
                type="submit"
                className="flex items-center rounded-lg bg-pink-500 px-3 py-2 text-sm font-bold duration-150 hover:bg-pink-600"
              >
                {createTagLoading ? (
                  <Loader white />
                ) : (
                  <PlusIcon className="w-4" />
                )}{" "}
                Add Tag
              </button>
            </div>

            {methods.formState.errors.title?.message && (
              <p className="text-red-700">
                {methods.formState.errors.title?.message}
              </p>
            )}
          </form>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Index;

Index.getLayout = AdminDashboardLayout;
