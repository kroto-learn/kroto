import Head from "next/head";
import React, { type ReactNode } from "react";
import { DashboardLayout } from "..";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import ImageWF from "@/components/ImageWF";
import TestimonialDisclosure from "@/components/TestimonialDisclosure";

const Index = () => {
  const { data: testimonials, isLoading: testimonialsLoading } =
    api.testimonial.getAllCreatorProtected.useQuery();

  if (testimonialsLoading)
    return (
      <>
        <Head>
          <title>Testimonials Received | Dashboard</title>
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Testimonials Received | Dashboard</title>
      </Head>
      {testimonials && testimonials.length > 0 ? (
        <div className="flex w-full max-w-3xl flex-col items-start gap-4">
          {testimonials.map((testimonial) => (
            <TestimonialDisclosure
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
          <div className="relative aspect-square w-40 object-contain">
            <ImageWF src="/empty/testimonial_empty.svg" alt="empty" fill />
          </div>
          <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
            You have not got any testimonials yet.
          </p>
          <button className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200">
            <EnvelopeIcon className="w-5" /> Ask for testimonial.
          </button>
        </div>
      )}
    </>
  );
};

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventsNestedLayout = nestLayout(DashboardLayout, EventsLayout);

Index.getLayout = EventsNestedLayout;

export default Index;

function EventsLayoutR({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <h1 className="text-2xl text-neutral-200">Testimonials</h1>
      </div>
      <div className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <ul className="-mb-px flex flex-wrap">
          <li className="mr-2">
            <Link
              href="/creator/dashboard/testimonials"
              className={`inline-block rounded-t-lg p-4 ${
                pathname === "/creator/dashboard/testimonials"
                  ? "border-b-2 border-pink-500 text-pink-500 transition"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
            >
              Received
            </Link>
          </li>
          <li>
            <Link
              href="/creator/dashboard/testimonials/given"
              className={`inline-block rounded-t-lg p-4 transition ${
                pathname === "/creator/dashboard/testimonials/given"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
              }`}
              aria-current="page"
            >
              Given
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}

function EventsLayout(page: ReactNode) {
  return <EventsLayoutR>{page}</EventsLayoutR>;
}

export { EventsLayout };
