import { Loader } from "@/components/Loader";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import {
  ArrowSmallRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { object, string, type z } from "zod";
import { MixPannelClient } from "@/analytics/mixpanel";

const contentLimit = 500;

const testimonialFormSchema = object({
  content: string().max(contentLimit).nonempty("Please enter feedback."),
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
  const router = useRouter();
  const session = useSession();

  const { creator_id } = router.query as { creator_id: string };
  const { data: creator, isLoading: creatorLoading } =
    api.creator.getPublicProfile.useQuery({
      creatorProfile: creator_id,
    });

  const { data: testimonial, isLoading: testimonialLoading } =
    api.testimonial.getOne.useQuery({
      creatorProfile: creator_id,
    });

  const testimonialExists = !!testimonial;

  const isLoading =
    session.status === "loading" || creatorLoading || testimonialLoading;

  const methods = useZodForm({
    schema: testimonialFormSchema,
    defaultValues: {
      content: "",
    },
  });

  const {
    mutateAsync: addTestimonialMutation,
    isLoading: addTestimonialLoading,
  } = api.testimonial.add.useMutation();

  const {
    mutateAsync: updateTestimonialMutation,
    isLoading: updateTestimonialLoading,
  } = api.testimonial.update.useMutation();

  const [submitted, setSubmitted] = useState(false);

  const ctx = api.useContext();

  const { successToast, errorToast, warningToast } = useToast();

  useEffect(() => {
    if (testimonialExists) {
      methods.setValue("content", testimonial?.content ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonial, testimonialExists]);

  const revalidate = useRevalidateSSG();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {isLoading ? (
        <Loader size="lg" />
      ) : submitted ? (
        <div className="flex w-full max-w-3xl flex-col items-center gap-2">
          <h1 className="text-2xl md:text-3xl">
            {"🙏"} Thank you for your testimonial!
          </h1>
          <Link
            className="text-medium group mt-8 flex items-center text-xl text-pink-500"
            href={`/${creator?.creatorProfile ?? ""}`}
          >
            See more events and courses by {creator?.name ?? ""}{" "}
            <ArrowSmallRightIcon className="ml-2 w-8 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            if (creator?.id === session?.data?.user.id) {
              warningToast("You cannot submit testimonial for yourself!");
              return;
            }

            if (!testimonialExists) {
              MixPannelClient.getInstance().giveTestimonialSubmitted({
                userId: session.data?.user.id ?? "",
                creatorProfile: creator?.creatorProfile ?? "",
              });
              await addTestimonialMutation(
                {
                  ...values,
                  creatorProfile: creator_id,
                },
                {
                  onSuccess: (testimonialGen) => {
                    successToast("Testimonial submitted successfully");
                    setSubmitted(true);
                    void ctx.testimonial.getOne.invalidate();
                    void revalidate(`/${testimonialGen.creatorProfile}`);
                  },
                  onError: () => {
                    errorToast("Error in submitting testimonial");
                  },
                }
              );
            } else {
              await updateTestimonialMutation(
                {
                  ...values,
                  id: testimonial?.id ?? "",
                },
                {
                  onSuccess: () => {
                    successToast("Testimonial submitted successfully");
                    setSubmitted(true);
                    void ctx.testimonial.getOne.invalidate();
                    void revalidate(`/${testimonial.creatorProfile}`);
                  },
                  onError: () => {
                    errorToast("Error in submitting testimonial");
                  },
                }
              );
            }
          })}
          className="my-8 flex w-full max-w-3xl flex-col items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-l from-neutral-900 to-neutral-800 p-6 px-4 md:items-start md:p-10 md:px-12"
        >
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl lg:justify-start lg:text-2xl">
            <span>Write a testimonial for</span>
            <ImageWF
              src={creator?.image ?? ""}
              width={30}
              height={30}
              alt={creator?.name ?? ""}
              className="rounded-full"
            />
            <span className="font-medium">{creator?.name ?? ""}</span>
          </div>

          <textarea
            value={methods.watch()?.content}
            onChange={(e) => {
              methods.setValue(
                "content",
                e.target?.value.substring(0, contentLimit)
              );
            }}
            rows={6}
            className="mt-6 w-full rounded-xl border-0 bg-neutral-700 p-4 outline-0 placeholder:text-neutral-400"
            placeholder="Write me a testimonial..."
          />
          {
            <p className="w-full text-end text-neutral-600">
              {methods.watch()?.content?.length}/{contentLimit}
            </p>
          }
          {methods.formState.errors.content?.message && (
            <p className="text-red-700">
              {methods.formState.errors.content?.message}
            </p>
          )}
          <button
            type="submit"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-lg font-medium text-neutral-200 outline-0 duration-150 hover:bg-pink-700"
          >
            Submit
            {(
              testimonialExists
                ? updateTestimonialLoading
                : addTestimonialLoading
            ) ? (
              <Loader white />
            ) : (
              <PaperAirplaneIcon className="w-5 transition-transform duration-150 group-hover:translate-x-1" />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Index;
