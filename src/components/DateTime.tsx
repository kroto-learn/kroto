import { ClockIcon } from "@heroicons/react/20/solid";
import React from "react";
import { IoTodayOutline } from "react-icons/io5";

type Prop = {
  datetime: Date;
  endTime: Date;
};

const DateTime = ({ datetime, endTime }: Prop) => {
  return (
    <p className="m-0 flex items-center gap-3 p-0 text-left text-sm text-neutral-300">
      <span className="flex items-center gap-1">
        <IoTodayOutline />{" "}
        {datetime?.toLocaleString("en-US", {
          weekday: "long",
        })}
      </span>
      <span className="flex items-center gap-1">
        {" "}
        <ClockIcon className="mt-[0.15rem] w-5" />
        {datetime?.toLocaleString("en-US", {
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
