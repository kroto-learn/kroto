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
import { PlusIcon } from "@heroicons/react/20/solid";

export const createCategoryFormSchema = z.object({
  title: z.string().min(3).nonempty("Please enter category title."),
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
    schema: createCategoryFormSchema,
  });

  const { successToast, errorToast } = useToast();

  const { data: categories, isLoading: catgsLoading } =
    api.course.getCategories.useQuery();

  const { mutateAsync: createCategoryMutation, isLoading: createCatgLoading } =
    api.course.createCategory.useMutation();

    const ctx = api.useContext();

  return (
    <>
      <Head>
        <title>Categories | Dashboard</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <AnimatedSection className="flex w-full items-center justify-between gap-4 sm:px-4">
          <h1 className="text-2xl text-neutral-200">Categories</h1>
        </AnimatedSection>
        {catgsLoading ? (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : !(categories instanceof TRPCError) &&
          categories &&
          categories.length > 0 ? (
          <AnimatedSection
            delay={0.2}
            className="flex w-full flex-col items-start gap-4"
          >
            {categories?.map((catg) => (
              <li key={catg?.id}>{catg?.title}</li>
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection
            delay={0.2}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 text-center"
          >
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not created any category yet.
            </p>
          </AnimatedSection>
        )}
        <AnimatedSection className="w-full" delay={0.3}>
          <form
            onSubmit={methods.handleSubmit(async (values) => {
              await createCategoryMutation(values, {
                onSuccess: (catg) => {
                  if (catg && !(catg instanceof TRPCError)) {
                    successToast(`New category ${catg.title} created.`);
                  }
                  methods.setValue("title","")
                  void ctx.course.getCategories.invalidate();
                },
                onError: () => {
                  errorToast("Error in creating category!");
                },
              });
            })}
            className="flex w-full flex-col gap-2"
          >
            <div className="flex w-full items-center gap-4">
              <input
                placeholder="New category title..."
                {...methods.register("title")}
                className="w-full max-w-sm rounded-lg bg-pink-500/10 px-3 py-2 font-medium text-neutral-200 outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
              />
              <button
                type="submit"
                className="flex items-center rounded-lg bg-pink-500 px-3 py-2 text-sm font-bold duration-150 hover:bg-pink-600"
              >
                {createCatgLoading ? (
                  <Loader white />
                ) : (
                  <PlusIcon className="w-4" />
                )}{" "}
                Add Category
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
