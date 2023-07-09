import { api } from "@/utils/api";
import { ArrowUpRightIcon, EnvelopeIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/router";
import AnimatedSection from "./AnimatedSection";

type Props = {
  setStartEventModal: (value: boolean) => void;
};

const EventStateBanner = ({ setStartEventModal }: Props) => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: event, isLoading: isEventLoading } = api.event.get.useQuery({
    id,
  });

  if (!event) return <></>;

  const isEventLive =
    event &&
    event?.datetime?.getTime() <= new Date().getTime() &&
    event?.endTime?.getTime() >= new Date().getTime();

  const isEventIn10min =
    event &&
    (event?.datetime ?? new Date()).getTime() <=
      new Date().getTime() + 600000 &&
    (event?.endTime ?? new Date()).getTime() >= new Date().getTime();

  const isEventOver = event && event?.endTime?.getTime() < new Date().getTime();
  return (
    <>
      {isEventLoading ? (
        <></>
      ) : isEventLive ? (
        <AnimatedSection
          delay={0.1}
          className="flex w-full max-w-3xl flex-col items-center justify-between gap-4 rounded-xl bg-neutral-800 px-3 py-2 sm:flex-row"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
              <span className="h-4/5 w-4/5 rounded-full bg-pink-500"></span>
            </span>
            The Event is Live Now.
          </div>
          {event.eventType === "virtual" ? (
            <button
              onClick={() => {
                setStartEventModal(true);
              }}
              className={`group inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/20 px-4 py-2 text-center text-xs font-medium text-pink-600 transition-all duration-300 hover:bg-pink-500 hover:text-neutral-200`}
            >
              Join Event <ArrowUpRightIcon className="w-4" />
            </button>
          ) : (
            <></>
          )}
        </AnimatedSection>
      ) : isEventIn10min ? (
        <AnimatedSection
          delay={0.1}
          className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl bg-yellow-500/20 px-3 py-2 text-yellow-500"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-yellow-500 opacity-75"></span>
              <span className="h-4/5 w-4/5 rounded-full bg-yellow-500"></span>
            </span>
            The Event is about to start.
          </div>
        </AnimatedSection>
      ) : isEventOver ? (
        <AnimatedSection
          delay={0.1}
          className="flex w-full max-w-3xl flex-col items-center justify-between gap-4 rounded-xl bg-neutral-800 px-3 py-2 sm:flex-row"
        >
          <div className="flex items-center gap-2">
            The Event has concluded.
          </div>
          <button
            onClick={() => {
              console.log("ask for feedback clicked");
            }}
            className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-xs font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
          >
            <EnvelopeIcon className="w-3" />
            Ask for feedback
          </button>
        </AnimatedSection>
      ) : (
        <></>
      )}
    </>
  );
};

export default EventStateBanner;
