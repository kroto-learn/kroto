import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import { api } from "@/utils/api";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { type Testimonial } from "@prisma/client";
import dynamic from "next/dynamic";
import Head from "next/head";
import ImageWF from "@/components/ImageWF";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const TestimonialEditModal = dynamic(
  () => import("@/components/TestimonialEditModal"),
  {
    ssr: false,
  }
);

const Index = () => {
  const { data: testimonials, isLoading: testimonialsLoading } =
    api.testimonial.getAllUser.useQuery();
  const [testimonialToEdit, setTestimonialToEdit] =
    useState<Testimonial | null>(null);

  if (testimonialsLoading)
    return (
      <>
        <Head>
          <title>Testimonials Given | Dashboard</title>
        </Head>
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  return (
    <Layout>
      <Head>
        <title>Testimonials</title>
      </Head>
      <div className="my-12 flex w-full flex-col items-center p-6">
        <div className="flex min-h-screen w-full max-w-2xl flex-col items-start gap-4">
          <h1 className="text-3xl font-medium">Testimonials</h1>
          {testimonials && testimonials.length > 0 ? (
            <div className="flex w-full flex-col items-start gap-4">
              {testimonials.map((testimonial) => (
                <Disclosure key={testimonial?.id ?? ""}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="z-2 flex w-full items-center justify-between rounded-xl bg-neutral-800 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span>For</span>
                          {/* <ImageWF
                            src={testimonial.user.image ?? ""}
                            height={25}
                            width={25}
                            alt={testimonial.user.name ?? ""}
                            className="aspect-square rounded-full object-cover"
                          /> */}
                          <Link
                            href={`/${testimonial?.creatorProfile}`}
                            className={`text-center text-neutral-300 transition-all duration-300 hover:text-neutral-200 lg:text-left`}
                          >
                            {/* <span className="font-medium text-pink-500">@</span> */}
                            <FontAwesomeIcon
                              icon={faAt}
                              className="mr-[0.15rem] text-sm text-pink-500"
                            />
                            {testimonial?.creatorProfile}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setTestimonialToEdit(testimonial)}
                            className="flex items-center gap-1 rounded-lg bg-neutral-700 p-1 px-2 text-xs duration-150 hover:bg-neutral-200 hover:text-neutral-800"
                          >
                            <PencilIcon className="w-3" />
                            Edit
                          </button>
                          <ChevronDownIcon
                            className={`duration-150 ${
                              open ? "rotate-180" : ""
                            } w-5`}
                          />
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="realtive z-0 w-full -translate-y-6 rounded-b-xl bg-neutral-800 px-4 py-4 text-gray-300">
                        <FontAwesomeIcon
                          icon={faQuoteLeft}
                          className="absolute text-neutral-400"
                        />{" "}
                        <p className="ml-6 mt-1">{testimonial?.content}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
              <div className="relative aspect-square w-40 object-contain">
                <ImageWF src="/empty/testimonial_empty.svg" alt="empty" fill />
              </div>
              <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
                You have not written any testimonials.
              </p>
            </div>
          )}
          {/* side edit event drawer */}

          <div
            className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-xl flex-col gap-4 overflow-y-auto bg-neutral-800 p-4 drop-shadow-2xl transition-transform ${
              testimonialToEdit ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              onClick={() => {
                setTestimonialToEdit(null);
              }}
              className="self-start rounded-xl border border-neutral-500 p-1 text-xl text-neutral-400"
            >
              <XMarkIcon className="w-5" />
            </button>

            {testimonialToEdit ? (
              <TestimonialEditModal
                testimonial={testimonialToEdit}
                setModalOpen={setTestimonialToEdit}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
