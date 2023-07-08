import { api } from "@/utils/api";
import Head from "next/head";
import ImageWF from "@/components/ImageWF";
import { Loader } from "@/components/Loader";
import { DashboardLayout } from ".";
import { useEffect, useState } from "react";
import { array, object, string, literal, z, union } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/hooks/useToast";
import {
  ArrowUpTrayIcon,
  MinusIcon,
  PlusIcon,
  CloudIcon,
} from "@heroicons/react/20/solid";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import AnimatedSection from "@/components/AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const bioLimit = 180;

export const creatorEditSchema = object({
  name: string().nonempty("Please enter your name."),
  creatorProfile: string().nonempty("Please enter your unique username."),
  number: union([string().min(10).max(10), z.undefined(), string().optional()]),
  bio: string().max(bioLimit).optional(),
  socialLinks: array(
    object({
      id: string(),
      type: string(),
      url: string().url().nonempty("Please enter social link URL."),
    })
  ),
  image: string().nonempty("Please upload your profile image."),
  topmateUrl: string().url().optional().or(literal("")),
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
  const { mutateAsync: deleteSocialLink } =
    api.creator.deleteSocialLink.useMutation();
  const [creatorinit, setCreatorinit] = useState(false);

  const [updating, setUpdating] = useState<boolean>(false);

  const methods = useZodForm({
    schema: creatorEditSchema,
    defaultValues: {
      socialLinks: [],
    },
  });

  const { warningToast, errorToast } = useToast();

  const { data: creatorProfileAvailable } =
    api.creator.userNameAvailable.useQuery({
      creatorProfile: methods.watch().creatorProfile,
    });

  useEffect(() => {
    if (creator && !creatorinit) {
      setCreatorinit(true);
      methods.setValue(
        "socialLinks",
        creator.socialLinks?.map((sl) => ({
          type: sl.type,
          url: sl.url,
          id: sl.id,
        })) ?? []
      );

      methods.setValue("image", creator?.image ?? "");
      methods.setValue("bio", creator?.bio ?? "");
    }
  }, [creator, methods, creatorinit]);

  const socialOptions: { type: string; title: string }[] = [
    {
      type: "youtube",
      title: "YouTube",
    },
    {
      type: "twitter",
      title: "Twitter",
    },
    {
      type: "instagram",
      title: "Instagram",
    },
    {
      type: "linkedin",
      title: "Linkedin",
    },
    {
      type: "website",
      title: "Website",
    },
  ];

  const revalidate = useRevalidateSSG();
  const ctx = api.useContext();

  if (isLoading)
    return (
      <>
        <Head>
          <title>Settings | Dashboard</title>
        </Head>
        <div className="flex h-screen items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Settings | Dashboard</title>
      </Head>
      <div className="my-10 flex w-full px-2">
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            setUpdating(true);
            try {
              if (
                values.creatorProfile === creator?.creatorProfile ||
                creatorProfileAvailable
              )
                try {
                  await updateProfile(
                    {
                      name: values.name,
                      mobileNumber: values.number,
                      bio: values?.bio ?? "",
                      creatorProfile: values.creatorProfile,
                      socialLink: values.socialLinks,
                      topmateUrl: values?.topmateUrl ?? "",
                      image: values?.image ?? "",
                    },
                    {
                      onSuccess: () => {
                        void ctx.creator.getProfile.invalidate();
                        void revalidate(`/${creator?.creatorProfile ?? ""}`);
                      },
                      onError: () => {
                        errorToast("Error updating your profile!");
                      },
                    }
                  );
                } catch (e) {
                  console.log(e);
                }
              else warningToast("Username not available.");
            } catch (error) {
              console.log(error);
            }
            setUpdating(false);
          })}
          className="my-5 flex flex-col items-center rounded-xl p-5"
        >
          <AnimatedSection className="relative mb-5">
            <div
              className={`relative mb-5 aspect-square w-28 overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
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
                <ArrowUpTrayIcon className="w-5" />
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
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="w-full">
            <div className="flex w-full flex-col gap-5 sm:flex-row">
              <div className="w-full">
                <label className="mb-2 block font-medium text-neutral-400">
                  Name
                </label>
                <div className="relative">
                  <input
                    {...methods.register("name")}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
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
              <div className="mb-5 w-full">
                <label className="mb-2 block font-medium text-neutral-400">
                  Kreator Profile
                </label>
                <div className="flex w-full">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-600 bg-neutral-700 px-3 font-medium text-neutral-400">
                    kroto.in/
                  </span>
                  <input
                    {...methods.register("creatorProfile")}
                    className="block w-[calc(100%-4rem)] rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent xl:w-full"
                    placeholder="rosekamallove"
                    defaultValue={(creator && creator.creatorProfile) ?? ""}
                  />
                </div>
                {methods.formState.errors.creatorProfile?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.creatorProfile?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4 flex w-full flex-col items-start">
              <label className="mb-2 block font-medium text-neutral-400">
                Social Links
              </label>
              <div className="mb-4 flex w-full flex-col justify-start gap-4">
                {methods.watch()?.socialLinks.map((link, idx) => (
                  <>
                    <fieldset
                      name={`socialLinks.${idx}`}
                      key={`socialLinks.${idx}`}
                    >
                      <div className="flex items-center">
                        <select
                          onChange={(e) => {
                            methods.setValue(
                              `socialLinks.${idx}.type`,
                              e.target.value
                            );
                          }}
                          value={
                            methods.watch().socialLinks[idx]?.type ?? "youtube"
                          }
                          className="z-10 items-center rounded-l-lg border border-neutral-700 bg-neutral-800 px-2 py-2 text-center font-medium text-neutral-200 outline-0"
                        >
                          {socialOptions.map((so) => (
                            <option
                              disabled={
                                !!methods
                                  .watch()
                                  .socialLinks.find((sl) => sl.type === so.type)
                              }
                              key={so.type}
                              value={so.type}
                            >
                              {so.title}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                        <input
                          {...methods.register(`socialLinks.${idx}.url`)}
                          className="w-full rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                          placeholder="https://"
                        />
                        <button
                          className="ml-2 rounded-lg bg-red-500/30 p-1 text-neutral-200/50 duration-300 hover:bg-red-500 hover:text-neutral-200"
                          onClick={async () => {
                            const deleteId =
                              methods.watch().socialLinks[idx]?.id;
                            methods.setValue(
                              "socialLinks",
                              methods
                                .watch()
                                .socialLinks.filter((sl, iidx) => idx !== iidx)
                            );
                            try {
                              if ((deleteId as string) !== "")
                                await deleteSocialLink(
                                  {
                                    id: deleteId as string,
                                  },
                                  {
                                    onSuccess: () => {
                                      void ctx.creator.getProfile.invalidate();
                                      void revalidate(`/${creator?.id ?? ""}`);
                                    },
                                    onError: () => {
                                      errorToast(
                                        "Error in deleting Social Link!"
                                      );
                                    },
                                  }
                                );
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                        >
                          <MinusIcon className="w-5" />
                        </button>
                      </div>
                      {methods.formState.errors.socialLinks?.[idx]?.url
                        ?.message && (
                        <p className="text-red-700">
                          {
                            methods.formState.errors.socialLinks?.[idx]?.url
                              ?.message
                          }
                        </p>
                      )}
                    </fieldset>
                  </>
                ))}
              </div>
              <button
                type="button"
                disabled={methods.watch().socialLinks.length > 5}
                onClick={() => {
                  methods.setValue("socialLinks", [
                    ...methods.watch().socialLinks,
                    { id: "", type: "other", url: "" },
                  ]);
                }}
                className="flex items-center gap-1 rounded-lg border border-pink-600 bg-pink-600/10 px-2 py-1 text-sm font-medium text-pink-600 backdrop-blur-sm transition duration-300 hover:bg-pink-600 hover:text-pink-200 disabled:border-neutral-600 disabled:bg-neutral-600/10 disabled:text-neutral-700"
              >
                <PlusIcon className="w-5" /> Add Link
              </button>
              {methods.formState.errors.socialLinks?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.socialLinks?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="w-full">
                <label className="mb-2 block font-medium text-neutral-400">
                  Topmate Profile URL
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-600 bg-neutral-700 px-3 font-medium text-neutral-400">
                    <div className="group relative h-4 w-4">
                      <ImageWF
                        src="/topmate_logo.png"
                        alt="topmate"
                        fill
                        className="opacity-70 group-hover:opacity-100"
                      />
                    </div>
                  </span>
                  <input
                    {...methods.register("topmateUrl")}
                    className="block w-full rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="https://topmate.io/"
                    defaultValue={(creator && creator.topmateUrl) ?? ""}
                  />
                </div>
                {methods.formState.errors.topmateUrl?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.topmateUrl?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5 md:flex-row">
              <div className="w-full">
                <label className="mb-2 block font-medium text-neutral-400">
                  Mobile Number
                </label>
                <div className="relative flex w-full items-center">
                  <input
                    type="number"
                    {...methods.register("number")}
                    className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-11 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="0000000000"
                    defaultValue={(creator && creator.mobileNumber) ?? ""}
                  />
                  <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
                    +91
                  </p>
                </div>
                <p className="m-1 flex items-center gap-1 text-sm text-neutral-400">
                  For <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                  notifications.
                </p>
                {methods.formState.errors.number?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.number?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="my-5">
              <label className="mb-2 block font-medium text-neutral-400">
                Bio
              </label>
              <textarea
                rows={3}
                value={methods.watch().bio}
                onChange={(e) => {
                  methods.setValue(
                    "bio",
                    e.target?.value.substring(0, bioLimit)
                  );
                }}
                placeholder="I am this, and this and this"
                className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              />
              {
                <p className="text-end text-neutral-400">
                  {methods.watch()?.bio?.length}/{bioLimit}
                </p>
              }
              {methods.formState.errors.bio?.message && (
                <p className="text-red-700">
                  {methods.formState.errors.bio?.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`group inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
            >
              {updating ? <Loader white /> : <CloudIcon className="w-5" />} Save
              Changes
            </button>
          </AnimatedSection>
        </form>
      </div>
    </>
  );
};
export default Settings;

Settings.getLayout = DashboardLayout;
