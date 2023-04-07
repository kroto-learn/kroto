import React from "react";

type Prop = {
  datetime: string;
  duration: number;
};

const DateTime = ({ datetime, duration }: Prop) => {
  const date = new Date(datetime);
  const endTime = new Date(new Date(datetime).getTime() + duration * 60000);

  return (
    <p className="text-left text-xs text-neutral-400">
      {date?.toLocaleString("en-US", {
        weekday: "long",
      })}
      ,{" "}
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
  );
};

export default DateTime;
