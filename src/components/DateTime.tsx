import React, { useEffect, useState } from "react";

type Prop = {
  datetime: string;
  duration: number;
};

const DateTime = ({ datetime, duration }: Prop) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date(datetime));
    setEndTime(new Date(new Date(datetime).getTime() + duration * 60000));
  }, [datetime, duration]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[2.3rem] w-[2.5rem] flex-col overflow-hidden rounded-lg border border-neutral-600">
        <div className="h-[45%] w-full bg-neutral-600 text-center text-[0.6rem] font-semibold text-neutral-400/70">
          {date &&
            date?.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
        <p className="m-0 p-0 text-center text-sm font-medium text-neutral-400">
          {date?.getDate()}
        </p>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <p className="font-medium text-neutral-200">
          {date?.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-neutral-400">
          {date?.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}{" "}
          to{" "}
          {endTime?.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
};

export default DateTime;
