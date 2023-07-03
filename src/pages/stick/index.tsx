import { api } from "@/utils/api";
import { FireIcon } from "@heroicons/react/24/outline";
import { FireIcon as FireIcons, MinusIcon } from "@heroicons/react/20/solid";

export default function Dashboard() {
  const { data: profile } = api.creator.getProfile.useQuery();

  const streakEndDate = new Date(
    (profile?.learningStreak?.start ?? new Date())?.getFullYear(),
    (profile?.learningStreak?.start ?? new Date())?.getMonth(),
    (profile?.learningStreak?.start ?? new Date())?.getDate() +
      (profile?.learningStreak?.days ?? 0)
  );

  const dynamicWeek = [];

  console.log("day", new Date().toLocaleString("en-US", { weekday: "long" }));

  for (let i = -3; i <= 3; i++) {
    const weekday = new Date(
      streakEndDate?.getFullYear(),
      streakEndDate?.getMonth(),
      streakEndDate?.getDate() + i
    );

    dynamicWeek.push(weekday);
  }

  return (
    <div className="w-full">
      <div className="m-5 w-3/12 rounded-lg bg-neutral-900">
        <div className="flex items-center p-2">
          <div className="font-semibold">You are on</div>
          <div className="relative h-20 w-20">
            <div className="absolute flex h-full w-full flex-col items-center justify-center gap-1 font-bold">
              <p className="m-0 p-0 text-center text-2xl leading-4">
                {profile?.learningStreak?.days}
              </p>
              <p className="m-0 p-0 text-center text-xs leading-3 text-white">
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
        <div className="flex p-2">
          {dynamicWeek.map((wd, index) => {
            const ignore = index > 3;
            const isFilled = (profile?.learningStreak?.days ?? 0) >= 4 - index;
            return (
              <>
                <div
                  className={`mx-1 flex flex-col items-center gap-1 rounded-lg border border-neutral-700 p-2 ${
                    ignore ? "bg-neutral-900" : "bg-neutral-800"
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
                    {wd
                      .toLocaleString("en-US", { weekday: "short" })
                      .slice(0, 2)}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
