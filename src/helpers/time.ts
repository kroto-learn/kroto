const generateTimesArray = () => {
  const times: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    if (hour === 12) {
      // Special case: 12 PM
      times.push(`12:00 PM`);
    } else if (hour > 12) {
      // PM times
      for (let minute = 0; minute < 60; minute += 15) {
        const hour12Padded = hour12 < 10 ? `0${hour12}` : hour12;
        const minutePadded = minute < 10 ? `0${minute}` : minute;
        times.push(`${hour12Padded}:${minutePadded} PM`);
      }
    } else {
      // AM times
      for (let minute = 0; minute < 60; minute += 15) {
        const hour12Padded = hour12 < 10 ? `0${hour12}` : hour12;
        const minutePadded = minute < 10 ? `0${minute}` : minute;
        times.push(`${hour12Padded}:${minutePadded} AM`);
      }
    }
  }

  return times;
};

const giveFirstTimeIdx: (times: string[]) => number = (times) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    if (time) {
      const hour = parseInt(time.slice(0, 2), 10);
      const minute = parseInt(time.slice(3, 5), 10);
      const meridiem = time.slice(6);
      const hour24 = hour === 12 ? 12 : hour + (meridiem === "PM" ? 12 : 0);

      //   console.log("current", currentHour, currentMinute);
      //   console.log("currentn", hour24, minute);

      if (
        hour24 > currentHour ||
        (hour24 === currentHour && minute > currentMinute)
      ) {
        return i;
      }
    }
  }

  return 94;
};

const updateTimeInISOString = (isoString: string, time: string) => {
  // Convert the time string to hours and minutes
  const [time12, period] = time.split(" ");
  const [hours12, minutes] = (time12 as string).split(":").map(Number);
  const hours24 =
    hours12 === 12
      ? period === "AM"
        ? 0
        : 12
      : (hours12 as number) + (period === "PM" ? 12 : 0);

  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Set the hours and minutes of the new Date object
  date.setHours(hours24);
  date.setMinutes(minutes as number);

  // Return the updated ISO string
  return date.toISOString();
};

export { generateTimesArray, giveFirstTimeIdx, updateTimeInISOString };
