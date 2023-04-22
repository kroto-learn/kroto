import { EventCard } from "@/components/EventCard";
import { type Creator } from "interfaces/Creator";
import { getCreators } from "mock/getCreators";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "@/components/layouts/main";
import { ClaimLinkNew } from "@/components/ClaimLink";
import { api } from "@/utils/api";
import { Loader } from "@/components/Loader";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ClaimLinkBannerNew } from ".";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Dashboard({ creators }: { creators: Creator[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { data: profile, isLoading } = api.creator.getProfile.useQuery();

  const pathname = usePathname();
  const isPastTab = router.query.events === "past";
  const upcomingEvents = profile?.registrations.filter(
    (e) => e.endTime.getTime() >= new Date().getTime()
  );
  const pastEvents = profile?.registrations.filter(
    (e) => e.endTime.getTime() < new Date().getTime()
  );
  const events = isPastTab ? pastEvents : upcomingEvents;

  return (
    <Layout>
      <div className="mx-auto w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12">
        <div className="my-10 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Image
                width={80}
                height={80}
                alt={session?.user.name ?? ""}
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
                    You&apos;re looking nice today!
                  </span>
                </p>
              </div>
            </div>
            {/* <div className="flex flex-col gap-3">
              <button
                className={`group inline-flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-center font-medium text-neutral-200 transition duration-300 hover:bg-neutral-800`}
              >
                <MdAccountCircle />
                Account
              </button>
              <button
                className={`group inline-flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-center font-medium text-neutral-200 transition duration-300 hover:bg-neutral-800`}
              >
                <MdSubscriptions />
              Subscriptions
              </button>
            </div> */}
          </div>
        </div>
        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
          <h1 className="text-2xl text-neutral-200">Registered Events</h1>
          <div className="border-b border-neutral-400 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <ul className="-mb-px flex flex-wrap">
              <li className="mr-2">
                <Link
                  href="/dashboard"
                  className={`inline-block rounded-t-lg p-4 ${
                    !isPastTab
                      ? "border-b-2 border-pink-500 text-pink-500 transition"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                >
                  Upcoming
                </Link>
              </li>
              <li className="/creator/dashboard/events">
                <Link
                  href="/dashboard?events=past"
                  className={`inline-block rounded-t-lg p-4 transition ${
                    isPastTab
                      ? "border-b-2 border-pink-500 text-pink-500"
                      : "border-transparent hover:border-neutral-400 hover:text-neutral-400"
                  }`}
                  aria-current="page"
                >
                  Past
                </Link>
              </li>
            </ul>
          </div>

          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : (
            <>
              {events && events.length > 0 ? (
                <>
                  <div className="my-2 flex flex-col gap-2">
                    {events?.map((e) => (
                      <div key={e.id ?? ""}>
                        <EventCard event={e} />
                      </div>
                    ))}
                  </div>
                  {/* <div className="mx-5 mb-2 flex justify-between">
                    <button className="text-pink-500 transition hover:text-pink-600">
                      View More
                    </button>
                    <button className="text-pink-500 transition hover:text-pink-600">
                      Show past
                    </button>
                  </div> */}
                </>
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
                  <div className="relative aspect-square w-40 object-contain">
                    <Image src="/empty/event_empty.svg" alt="empty" fill />
                  </div>
                  <p className="mb-2 text-neutral-400">
                    {isPastTab
                      ? "You don't have any past registered events."
                      : "You don't have any upcoming registered events."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <ClaimLinkBannerNew />
        {/* <div> */}
        {/*   <h3 className="mb-5 text-2xl font-medium text-neutral-300"> */}
        {/*     Discover Creators */}
        {/*   </h3> */}
        {/*   <div> */}
        {/*     <form */}
        {/*       onSubmit={(e) => { */}
        {/*         e.preventDefault(); */}
        {/*         setSearchQuery(inputValue); */}
        {/*       }} */}
        {/*     > */}
        {/*       <label className="sr-only mb-2 text-sm font-medium dark:text-white"> */}
        {/*         Search */}
        {/*       </label> */}
        {/*       <div className="relative"> */}
        {/*         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> */}
        {/*           <MagnifyingGlassIcon className="w-5" /> */}
        {/*         </div> */}
        {/*         <input */}
        {/*           type="search" */}
        {/*           id="default-search" */}
        {/*           className="block w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 pl-10 text-sm placeholder-neutral-400 outline-none ring-transparent transition hover:border-neutral-600 focus:border-neutral-500 focus:ring-neutral-500 active:outline-none active:ring-transparent" */}
        {/*           placeholder="Search for you favorite creators..." */}
        {/*           onChange={(e) => setInputValue(e.target.value)} */}
        {/*         /> */}
        {/*         <button */}
        {/*           type="submit" */}
        {/*           className="absolute bottom-2.5 right-2.5 rounded-xl bg-pink-600 px-6 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-pink-800 " */}
        {/*         > */}
        {/*           Search */}
        {/*         </button> */}
        {/*       </div> */}
        {/*     </form> */}
        {/*     <div> */}
        {/*       {searchQuery === "" ? ( */}
        {/*         creators?.map((c) => <CreatorCard key={c.id} creator={c} />) */}
        {/*       ) : ( */}
        {/*         <div className="my-5 flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 p-5"> */}
        {/*           <h4 className="max-w-md text-center text-2xl text-neutral-400"> */}
        {/*             Hang in there, */}
        {/*           </h4> */}
        {/*           <div className="relative aspect-square h-56"> */}
        {/*             <Image */}
        {/*               width={80} */}
        {/*               height={80} */}
        {/*               className="h-56" */}
        {/*               src="/CatWorkingHard.png" */}
        {/*               fill */}
        {/*               alt="hard working cat" */}
        {/*             /> */}
        {/*           </div> */}
        {/*           <h4 className="max-w-md text-center text-2xl text-neutral-400"> */}
        {/*             We&apos;re working really hard to get more creators on */}
        {/*             board. */}
        {/*           </h4> */}
        {/*         </div> */}
        {/*       )} */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const creators = await getCreators();

  return {
    props: { creators },
  };
}

export const CreatorCard = ({ creator }: { creator: Creator }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => void router.push(`/${creator.id}`)}
      className="my-10 cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-neutral-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Image
            width={80}
            height={80}
            className="aspect-square w-28 rounded-full"
            src={creator?.image_url ?? ""}
            alt={creator?.name ?? ""}
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
