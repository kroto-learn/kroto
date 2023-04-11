import React from "react";

type Props = {
  date: Date;
};

const CalenderBox = ({ date }: Props) => {
  return (
    <div className="flex h-12 w-12 flex-col overflow-hidden rounded-lg border border-neutral-600">
      <div className="flex h-[45%] w-full flex-col justify-center bg-neutral-600 text-center text-xs font-medium text-neutral-400/70">
        {date &&
          date?.toLocaleString("default", { month: "short" }).toUpperCase()}
      </div>
      <p className="flex h-[55%] flex-col justify-center p-0 text-center text-base text-neutral-400">
        {date?.getDate()}
      </p>
    </div>
  );
};

export default CalenderBox;
