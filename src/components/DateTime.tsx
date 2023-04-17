import { ClockIcon } from "@heroicons/react/20/solid";
import React from "react";
import { IoTodayOutline } from "react-icons/io5";

type Prop = {
  datetime: string;
  duration: number;
};

const DateTime = ({ datetime, duration }: Prop) => {
  const date = new Date(datetime);
  const endTime = new Date(new Date(datetime).getTime() + duration * 60000);

  return (
    <p className="m-0 flex items-center gap-3 p-0 text-left text-sm text-neutral-300">
      <span className="flex items-center gap-1">
        <IoTodayOutline />{" "}
        {date?.toLocaleString("en-US", {
          weekday: "long",
        })}
      </span>
      <span className="flex items-center gap-1">
        {" "}
        <ClockIcon className="mt-[0.15rem] w-5" />
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
      </span>
    </p>
  );
};

export default DateTime;
