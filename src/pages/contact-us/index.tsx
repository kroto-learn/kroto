import Layout from "@/components/layouts/main";
import Head from "next/head";
import Link from "next/link";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EnvelopeIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { object, string, z, union } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";
import { Loader } from "@/components/Loader";

export const contactFormSchema = object({
  name: string().nonempty("Please enter your name."),
  email: string().email(),
  phone: union([string().min(10).max(10), z.undefined(), string().optional()]),
  message: string().max(500),
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

export default function Contact() {
  const methods = useZodForm({
    schema: contactFormSchema,
  });

  const { mutateAsync: contactMutation, isLoading: contactMutationLoading } =
    api.contact.contactUs.useMutation();

  const { successToast } = useToast();

  return (
    <Layout>
      <Head>
        <title>Contact</title>
      </Head>
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Contact Us</h1>
        <p className="mt-2 text-3xl">Ask any query or contact our team</p>
      </div>
      <div className="mt-10 flex min-h-[70vh] w-full justify-center">
        <div className="items-cente flex w-full max-w-4xl flex-row justify-between gap-8">
          <div>
            <h1 className="mb-3 text-3xl font-semibold">Contact Information</h1>
            <p className="mb-6 text-2xl font-semibold">
              Fill up the form and our team will <br /> contact you soon
            </p>
            <div className="mb-6">
              <Link
                href="mailto:kamal@kroto.in"
                className="mb-2 flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <EnvelopeIcon className="w-4" /> kamal@kroto.in
              </Link>
              <p className="mb-2 flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200">
                <FontAwesomeIcon icon={faPhone} className="w-4" /> +91
                7906682655
              </p>
              <p className="flex items-center gap-2 text-xs text-neutral-300">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mb-4 text-sm"
                />{" "}
                PBT BY PASS ROAD, STREET NO-3, PN/11/14/2 <br /> Shamat Ganj,
                Bareilly, Bareilly-243005, Uttar Pradesh.
              </p>
            </div>
            <div className="flex">
              <Link
                href="https://twitter.com/RoseKamalLove1"
                className="mr-5 flex items-center gap-2 text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <FontAwesomeIcon icon={faTwitter} className="mb-4 text-3xl" />
              </Link>
              <Link
                href="https://discord.com/invite/e5SnnVP3ad"
                className="flex items-center gap-2 text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <FontAwesomeIcon icon={faDiscord} className="mb-4 text-3xl" />
              </Link>
            </div>
          </div>
          <div className="w-full max-w-sm">
            <form
              onSubmit={methods.handleSubmit((values) => {
                void contactMutation(values, {
                  onSuccess: () => {
                    successToast(
                      "We have receive your message! We will contact you shortly."
                    );
                    methods.setValue("name", "");
                    methods.setValue("email", "");
                    methods.setValue("phone", "");
                    methods.setValue("message", "");
                  },
                });
              })}
              className="w-full"
            >
              <div className="mb-2">
                <label className="mb-2 block font-medium text-neutral-400">
                  Your Name <span className="text-red-700">*</span>
                </label>
                <div>
                  <input
                    {...methods.register("name")}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Enter Your Name"
                  />
                </div>
                {methods.formState.errors.name?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.name?.message}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label className="mb-2 block font-medium text-neutral-400">
                  Your Email <span className="text-red-700">*</span>
                </label>
                <div>
                  <input
                    {...methods.register("email")}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Enter your Email"
                  />
                </div>
                {methods.formState.errors.email?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.email?.message}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label className="mb-2 block font-medium text-neutral-400">
                  Your Phone Number
                </label>
                <div>
                  <input
                    {...methods.register("phone")}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Enter your Phone Number"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="mb-2 block font-medium text-neutral-400">
                  Message <span className="text-red-700">*</span>
                </label>
                <div>
                  <textarea
                    value={methods.watch().message}
                    onChange={(e) => {
                      methods.setValue(
                        "message",
                        e.target?.value.substring(0, 500)
                      );
                    }}
                    className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Enter Your Message"
                  />
                </div>
                {
                  <p className="text-end text-neutral-400">
                    {methods.watch()?.message?.length ?? 0}/{500}
                  </p>
                }
                {methods.formState.errors.message?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.message?.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={`group inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
              >
                Send Message{" "}
                {contactMutationLoading ? (
                  <Loader white />
                ) : (
                  <PaperAirplaneIcon className="w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
