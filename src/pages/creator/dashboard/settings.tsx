import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import { FaSave } from "react-icons/fa";
import { Loader } from "@/components/Loader";
import { DashboardLayout } from ".";
import { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { object, string, type z } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const creatorEditSchema = object({
  name: string({
    required_error: "Please enter your name.",
  }),
  id: string({
    required_error: "Please enter your unique username.",
  }),
  bio: string({
    required_error: "Please enter event description.",
  }).max(150),
  link: string().url().optional(),
  image: string().optional(),
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

const Settings = () => {
  const { data: creator, isLoading } = api.creator.getProfile.useQuery();
  const { mutateAsync: updateProfile } =
    api.creator.updateProfile.useMutation();

  const [updating, setUpdating] = useState<boolean>(false);

  const methods = useZodForm({
    schema: creatorEditSchema,
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <>
      <Head>
        <title>Settings | Dashboard</title>
      </Head>
      <div className="mx-5 my-10 w-full">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={methods.handleSubmit(async (values) => {
            setUpdating(true);
            console.log("link", values.link);
            try {
              await updateProfile({
                name: values.name,
                bio: values.bio,
                creatorProfile: values.id,
              });
            } catch (error) {
              console.log(error);
            }
            setUpdating(false);
          })}
          className="my-5 flex flex-col items-center rounded-xl p-5"
        >
          {/* <h2 className="mb-5 text-2xl">Profile</h2> */}
          <div className="relative mb-5">
            <div
              className={`relative mb-5 aspect-square w-28 overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
            >
              <Image
                // src={methods.getValues("image")}
                src={(creator && creator.image) ?? ""}
                alt={methods.getValues("name")}
                fill
              />
            </div>
            <div className="absolute bottom-4 right-2 z-50 cursor-pointer rounded-full bg-neutral-800 p-2 text-base transition-all duration-300 hover:bg-neutral-700">
              <BsUpload />
            </div>
            {methods.formState.errors.image?.message && (
              <p className="text-red-700">
                {methods.formState.errors.image?.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-5">
              <div>
                <label className="mb-2 block font-medium text-neutral-400">
                  Name
                </label>
                <div className="relative mb-6">
                  <input
                    {...methods.register("name")}
                    className="block min-w-[20rem] rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Your Name, not your mom's"
                    defaultValue={(creator && creator.name) ?? ""}
                  />
                </div>
                {methods.formState.errors.name?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.name?.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-400">
                  Kreator Profile
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-600 bg-neutral-700 px-3 font-medium text-neutral-400">
                    kroto.in/@
                  </span>
                  <input
                    {...methods.register("id")}
                    className="block min-w-[14rem] rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="rosekamallove"
                    defaultValue={(creator && creator.creatorProfile) ?? ""}
                  />
                </div>
                {methods.formState.errors.id?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.id?.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-400">
                Bio
              </label>
              <div className="relative mb-6">
                <textarea
                  {...methods.register("bio")}
                  className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                  placeholder="I am this, and this and this"
                  defaultValue={(creator && creator.bio) ?? ""}
                />
              </div>
              {methods.formState.errors.bio?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.bio?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full px-6">
            <div>
              <label className="mb-2 block font-medium text-neutral-400">
                Link
              </label>
              <div className="relative mb-6">
                <input
                  {...methods.register("link")}
                  className="block min-w-[20rem] rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                  placeholder="Your Name, not your mom's"
                />
              </div>
              {methods.formState.errors.link?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.link?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full px-6">
            <button
              type="submit"
              className={`group my-5 inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
            >
              {updating ? <Loader /> : <FaSave />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Settings;

Settings.getLayout = DashboardLayout;
