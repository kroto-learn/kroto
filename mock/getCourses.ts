import { promises as fs } from "fs";
import type { CourseEvent } from "interfaces/CourseEvent";
import path from "path";

export const getCourses = async () => {
  // We'd normally get data from an external data source
  const courses = (
    JSON.parse(
      await fs.readFile(path.join(process.cwd(), "mock") + "/data.json", "utf8")
    ) as { courses: CourseEvent[] }
  ).courses;

  return courses;
};
