import Layout from "@/components/layouts/main";
import Head from "next/head";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
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
      <div className="px-2 py-10 text-center">
        <h1 className="text-5xl font-semibold">Contact Us</h1>
        <p className="mt-2 text-3xl">Ask any query or contact our team</p>
      </div>
      <div className="flex w-full items-center justify-center">
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
          className="flex w-4/6 flex-col md:w-3/6 lg:w-2/5"
        >
          <div className="mb-2">
            <label className="mb-2 block font-medium text-neutral-400">
              Your Name <span className="text-red-700">*</span>
            </label>
            <input
              {...methods.register("name")}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              placeholder="Enter Your Name"
            />
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
            <input
              {...methods.register("email")}
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              placeholder="Enter your Email"
            />
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
            <input
              {...methods.register("phone")}
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              placeholder="Enter your Phone Number"
            />
          </div>
          <div className="mb-2">
            <label className="mb-2 block font-medium text-neutral-400">
              Message <span className="text-red-700">*</span>
            </label>
            <textarea
              value={methods.watch().message}
              onChange={(e) => {
                methods.setValue("message", e.target?.value.substring(0, 500));
              }}
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
              placeholder="Enter Your Message"
            />
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
          <div className="w-full">
            <button
              type="submit"
              className={`group flex w-full items-center justify-center gap-1 rounded-xl bg-pink-600 px-3 py-2 font-semibold text-white transition-all duration-300 hover:bg-pink-700 sm:w-auto`}
            >
              Send Message{" "}
              {contactMutationLoading ? (
                <Loader white />
              ) : (
                <PaperAirplaneIcon className="w-4 pt-1" />
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
