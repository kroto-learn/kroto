import React, { type ReactNode } from "react";
import { Disclosure } from "@headlessui/react";
import { DashboardLayout } from "../..";
import { EventLayout } from ".";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import ImageWF from "@/components/ImageWF";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { type Feedback, type User } from "@prisma/client";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: feedbacks, isLoading: feedbacksLoading } =
    api.eventFeedback.getFeedbacks.useQuery({ eventId: id });

  return (
    <AnimatedSection
      delay={0.2}
      className="min-h-[80%] w-full max-w-3xl rounded-xl bg-neutral-900 p-6"
    >
      <h3 className="mb-6 text-lg font-medium  sm:text-2xl">Feedbacks</h3>
      {feedbacksLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : feedbacks &&
        (
          feedbacks as (Feedback & {
            user: User;
          })[]
        ).length !== 0 ? (
        (
          feedbacks as (Feedback & {
            user: User;
          })[]
        )?.map((feedback) => (
          <Disclosure key={feedback?.id ?? ""}>
            {({ open }) => (
              <div className="mb-4 w-full">
                <Disclosure.Button className="z-2 flex w-full items-center justify-between rounded-xl bg-neutral-800 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center">
                      {feedback?.rating}
                      <StarIcon className="w-4 text-yellow-500" />
                    </span>
                    <ImageWF
                      src={feedback.user.image ?? ""}
                      height={25}
                      width={25}
                      alt={feedback.user.name ?? ""}
                      className="aspect-square rounded-full object-cover"
                    />
                    <p className="max-w-[8rem] overflow-hidden truncate text-ellipsis">
                      {feedback.user.name}
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={`duration-150 ${open ? "rotate-180" : ""} w-5`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="z-0 w-full -translate-y-2 rounded-b-xl bg-neutral-800 px-4 py-4 text-gray-300">
                  {feedback?.comment}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
          <div className="relative aspect-square w-40 object-contain">
            <ImageWF src="/empty/feedback_empty.svg" alt="empty" fill />
          </div>
          <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
            You have not got any feedbacks yet.
          </p>
          <button className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200">
            <EnvelopeIcon className="w-5" /> Ask for feedbacks
          </button>
        </div>
      )}
    </AnimatedSection>
  );
};

export default Index;

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const EventNestedLayout = nestLayout(DashboardLayout, EventLayout);

Index.getLayout = EventNestedLayout;
