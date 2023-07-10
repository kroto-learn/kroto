import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import { api } from "@/utils/api";
import Head from "next/head";
import useToast from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { object, string, type z } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import ImageWF from "@/components/ImageWF";

export const userEditSchema = object({
  name: string().nonempty("Please enter your name."),
  image: string().nonempty("Please upload your profile image."),
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
  const { data: user, isLoading } = api.creator.getProfile.useQuery();
  const { mutateAsync: updateUserProfile } =
    api.creator.updateDashboardProfile.useMutation();

  const [updating, setUpdating] = useState<boolean>(false);

  const methods = useZodForm({
    schema: userEditSchema,
  });

  const { warningToast, errorToast } = useToast();

  useEffect(() => {
    if (user) {
      methods.setValue("image", user?.image ?? "");
      methods.setValue("name", user?.name ?? "");
    }
  }, [user, methods]);

  const ctx = api.useContext();

  if (isLoading)
    return (
      <>
        <Head>
          <title> Profile Edit | Dashboard</title>
        </Head>
        <div className="flex h-screen items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <Layout>
      <Head>
        <title>Profile Edit | Dashboard</title>
      </Head>
      <div className="flex w-full justify-center">
        <div className=" flex w-6/12 flex-col items-center gap-4 rounded-md bg-neutral-900 md:w-4/12 md:p-10 ">
          <form
            onSubmit={methods.handleSubmit(async (values) => {
              setUpdating(true);
              try {
                await updateUserProfile(
                  {
                    name: values.name,
                    image: values?.image ?? "",
                  },
                  {
                    onSuccess: () => {
                      void ctx.creator.getProfile.invalidate();
                    },
                    onError: () => {
                      errorToast("Error updating your profile!");
                    },
                  }
                );
              } catch (e) {
                console.log(e);
              }
              setUpdating(false);
            })}
            className="flex flex-col items-center rounded-xl p-5"
          >
            <div className="relative mb-5">
              <div
                className={`relative aspect-square w-24 overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all md:w-28`}
              >
                <ImageWF
                  // src={methods.getValues("image")}
                  src={methods.watch().image ?? "/empty/courses.svg"}
                  alt={methods.getValues("name")}
                  fill
                />
              </div>
              <div className="absolute bottom-4 right-2 z-50 rounded-full bg-neutral-800 text-base transition-all duration-300 hover:bg-neutral-700">
                <div className="relative p-2">
                  <ArrowUpTrayIcon className="w-3 md:w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="z-2 absolute top-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files[0]) {
                        if (e.currentTarget.files[0].size <= 1024000) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            methods.setValue("image", reader.result as string);
                          };
                          reader.readAsDataURL(e.currentTarget.files[0]);
                        } else {
                          warningToast("Upload cover image upto 1 MB of size.");
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {methods.formState.errors.image?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.image?.message}
                </p>
              )}
            </div>
            <div className="flex w-full flex-col gap-5 sm:flex-row">
              <div className="w-full">
                <div className="relative">
                  <input
                    {...methods.register("name")}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Your Name, not your mom's"
                    defaultValue={(user && user?.name) ?? ""}
                  />
                </div>
                {methods.formState.errors.name?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.name?.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className={`group mt-3 inline-flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-1 text-center font-semibold text-white transition-all duration-300 hover:bg-pink-700 md:px-5 `}
            >
              {updating ? <Loader white /> : <></>} Update Profile
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
