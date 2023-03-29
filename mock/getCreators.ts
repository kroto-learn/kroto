import { promises as fs } from "fs";
import type { Creator } from "interfaces/Creator";
import path from "path";

export const getCreators = async () => {
  // We'd normally get data from an external data source
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), "mock") + "/data.json", "utf8")
  ) as { creators: Creator[] };
};
