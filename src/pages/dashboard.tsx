import CourseEventCard from "@/components/CourseEventCard";
import { CourseEvent } from "interfaces/CourseEvent";
import { Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import { getEvents } from "mock/getEvents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import { MdAccountCircle, MdSubscriptions } from "react-icons/md";

import HardWorkingCat from "public/CatWorkingHard.png";

export default function Dashboard({
  creators,
  events,
}: {
  creators: Creator[];
  events: CourseEvent[];
}) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="mx-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12">
      <div className="my-10 rounded-xl border border-neutral-700 bg-neutral-800 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              className="aspect-square w-28 rounded-full"
              src={session?.user.image ?? ""}
            />
            <div>
              <p>
                <span className="block text-neutral-400">Welcome back,</span>
                <span className="text-3xl font-medium text-neutral-200">
                  {session?.user.name}
                </span>
                <span className="block text-neutral-400">
                  You're looking nice today!
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              className={`group inline-flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-center font-medium text-neutral-200 transition hover:bg-neutral-700`}
            >
              <MdAccountCircle />
              Account
            </button>
            <button
              className={`group inline-flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-center font-medium text-neutral-200 transition hover:bg-neutral-700`}
            >
              <MdSubscriptions />
              Subscriptions
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-medium text-neutral-300">
          Upcoming Events
        </h3>
        {events?.map((e) => (
          <div key={e.ogdescription}>
            <RegisteredEvents event={e} />
            <br />
          </div>
        ))}
        <div className="mx-2 mb-10 flex justify-between">
          <button className="text-pink-500 transition hover:text-pink-600">
            View More
          </button>
          <button className="text-pink-500 transition hover:text-pink-600">
            Show past
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-medium text-neutral-300">
          Discover Creators
        </h3>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(inputValue);
            }}
          >
            <label className="sr-only mb-2 text-sm font-medium dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 p-4 pl-10 text-sm placeholder-neutral-400 outline-none ring-transparent transition focus:border-neutral-500 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                placeholder="Search for you favorite creators..."
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="absolute bottom-2.5 right-2.5 rounded-xl bg-pink-600 px-6 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-pink-700 "
              >
                Search
              </button>
            </div>
          </form>
          <div>
            {searchQuery === "" ? (
              creators?.map((c) => <CreatorCard key={c.id} creator={c} />)
            ) : (
              <div className="my-5 flex flex-col items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 p-5">
                <h4 className="max-w-md text-center text-2xl text-neutral-400">
                  Hang in there,
                </h4>
                <div className="relative aspect-square h-56">
                  <Image
                    className="h-56"
                    src={HardWorkingCat}
                    fill
                    alt="hard working cat"
                  />
                </div>
                <h4 className="max-w-md text-center text-2xl text-neutral-400">
                  We're working really hard to get more creators on board.
                </h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const creators = await getCreators();
  const events = await getEvents();

  return {
    props: { creators, events },
  };
}

export const RegisteredEvents = ({ event }: { event: CourseEvent }) => {
  return <CourseEventCard courseevent={event} />;
};

export const CreatorCard = ({ creator }: { creator: Creator }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/${creator.id}`)}
      className="my-10 cursor-pointer rounded-xl border border-neutral-700 bg-neutral-800 p-5 transition hover:border-neutral-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img
            className="aspect-square w-28 rounded-full"
            src={creator?.image_url ?? ""}
          />
          <div>
            <h3 className="mb-1 text-3xl font-medium text-neutral-200">
              {creator.name}
            </h3>
            <p className="text-neutral-400">{creator.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
