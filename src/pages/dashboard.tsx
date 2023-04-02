import { useSession } from "next-auth/react";
import { MdAccountCircle, MdSubscriptions } from "react-icons/md";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="mx-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12">
      {/* <ClaimLink variant="sm"/> */}
      <div className="my-20 rounded-lg border border-neutral-700 bg-neutral-800 p-5">
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
              className={`group inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-center font-medium text-neutral-200 transition hover:bg-neutral-700`}
            >
              <MdAccountCircle />
              Account
            </button>
            <button
              className={`group inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-center font-medium text-neutral-200 transition hover:bg-neutral-700`}
            >
              <MdSubscriptions />
              Subscriptions
            </button>
          </div>
        </div>
      </div>

      <div>
        <RegisteredEvents />
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-medium">Discover Creators</h3>
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
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
                className="block w-full rounded-lg border border-neutral-700 bg-neutral-800 p-4 pl-10 text-sm placeholder-neutral-400 outline-none ring-transparent focus:border-neutral-500 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                placeholder="Search for you favorite creators..."
                required
              />
              <button
                type="submit"
                className="absolute bottom-2.5 right-2.5 rounded-lg bg-pink-600 px-6 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-pink-700 "
              >
                Search
              </button>
            </div>
          </form>
          <div>
            <CreatorCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export const RegisteredEvents = () => {
  return <div />;
};

export const CreatorCard = () => {
  return <div></div>;
};
