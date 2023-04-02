import { promises as fs } from "fs";
import type { CourseEvent } from "interfaces/CourseEvent";
import path from "path";

export const getEvents = async () => {
  // We'd normally get data from an external data source

  const events = (
    JSON.parse(
      await fs.readFile(path.join(process.cwd(), "mock") + "/data.json", "utf8")
    ) as { events: CourseEvent[] }
  ).events;

  return events;
};
