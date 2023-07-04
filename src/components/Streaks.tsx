import { api } from "@/utils/api";
import { FireIcon } from "@heroicons/react/24/outline";
import { FireIcon as FireIcons, MinusIcon } from "@heroicons/react/20/solid";

export default function Streaks() {
  const { data: profile } = api.creator.getProfile.useQuery();

  const streakEndDate = new Date(
    (profile?.learningStreak?.start ?? new Date())?.getFullYear(),
    (profile?.learningStreak?.start ?? new Date())?.getMonth(),
    (profile?.learningStreak?.start ?? new Date())?.getDate() +
      (profile?.learningStreak?.days ?? 0)
  );

  const dynamicWeek = [];

  for (let i = -3; i <= 3; i++) {
    const weekday = new Date(
      streakEndDate?.getFullYear(),
      streakEndDate?.getMonth(),
      streakEndDate?.getDate() + i
    );

    dynamicWeek.push(weekday);
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      {profile?.learningStreak?.days &&
      profile?.learningStreak?.days > 0 &&
      !!profile?.learningStreak?.start ? (
        <div className="mb-2 flex items-center">
          <div className="font-semibold">You are on a</div>
          <div className="relative h-20 w-20">
            <div className="absolute flex h-full w-full flex-col items-center justify-center gap-1 font-bold">
              <p className="m-0 p-0 text-center text-2xl leading-4">
                {profile?.learningStreak?.days ?? 0}
              </p>
              <p className="m-0 p-0 text-center text-xs leading-3 text-neutral-200">
                {(profile?.learningStreak?.days ?? 0) > 1 ? "days" : "day"}
              </p>
            </div>
            <svg
              className="h-full w-full rotate-[120deg]"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke-linecap="round"
            >
              <path
                fill="none"
                className="dark:stroke-pink-00 stroke-pink-500"
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              ></path>
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                // style="transition: stroke-dashoffset 1s ease-in-out 0s; stroke: rgb(56, 189, 248); stroke-dasharray: 60.8074; stroke-dashoffset: 0;"
              ></path>
            </svg>
          </div>
          <div className="font-semibold">streak.</div>
        </div>
      ) : (
        <p className="mb-2 font-semibold">You don&apos;t have any streak.</p>
      )}
      <div className="flex">
        {dynamicWeek.map((wd, index) => {
          const ignore = index > 3;
          const isFilled = (profile?.learningStreak?.days ?? 0) >= 4 - index;
          return (
            <>
              <div
                className={`mx-1 flex flex-col items-center gap-1 rounded-lg border  p-2 text-neutral-300 ${
                  ignore
                    ? "border-neutral-700 bg-transparent"
                    : isFilled
                    ? "border-pink-500/20 bg-pink-500/10"
                    : "border-neutral-700 bg-neutral-800"
                }`}
              >
                {!ignore ? (
                  isFilled ? (
                    <FireIcons
                      className={`w-6 ${isFilled ? "text-pink-500" : ""}`}
                    />
                  ) : (
                    <div className="relative">
                      <FireIcon className={`w-6`} />
                      <MinusIcon className="absolute -left-2 -top-2 w-10 rotate-45" />
                    </div>
                  )
                ) : (
                  <FireIcon className={`w-6`} />
                )}
                <p className="text-center text-xs font-bold">
                  {wd.toLocaleString("en-US", { weekday: "short" }).slice(0, 2)}
                </p>
              </div>
            </>
          );
        })}
      </div>
      <hr className="my-2 opacity-20" />
      <p className="text-neutral-400">
        Learn in your courses daily to increase your streak.
      </p>
    </div>
  );
}

const StreaksMobile = () => {
  const { data: profile } = api.creator.getProfile.useQuery();

  return (
    <>
      {profile?.learningStreak?.days &&
      profile?.learningStreak?.days > 0 &&
      !!profile?.learningStreak?.start ? (
        <div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-2 px-4">
          <div className="flex w-full justify-center p-2 px-4">
            <div className="flex items-center text-center">
              You are on a <FireIcons className="ml-1 w-6 text-pink-500" />
              <span className="mr-1 text-2xl font-bold">
                {profile?.learningStreak?.days ?? 0}
              </span>
              day
              {profile?.learningStreak?.days > 1 ? "s " : " "}
              streak.
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export { StreaksMobile };
