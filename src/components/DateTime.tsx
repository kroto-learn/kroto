import React from "react";
import { BiTimeFive } from "react-icons/bi";
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
        <BiTimeFive className="mt-[0.15rem]" />
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
