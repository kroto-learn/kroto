import { z } from "zod";
import axios from "axios";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

export const creatorAnalyticsRouter = createTRPCRouter({
  getCourseViewes: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input }) => {
      const data = await getAanalyticsFromMixPanel({
        from_date: "2023-07-01",
        to_date: "2023-07-09",
        limit: 2,
        event: `["Course Viewed"]`,
        where: `properties["courseId"] == "${input.courseId}"`,
      });

      const jsonArray = `{${data.replace(/\n/g, ",\n")}}`;

      return JSON.stringify(jsonArray);
    }),
});

const getAanalyticsFromMixPanel = async ({
  from_date,
  to_date,
  limit,
  event,
  where,
}: {
  from_date: string;
  to_date: string;
  limit: number;
  event: string;
  where: string;
}): Promise<string> => {
  const SECRET = new Buffer(env.MIXPANEL_SECRET).toString("base64");
  const options = {
    method: "GET",
    url: "https://data-eu.mixpanel.com/api/2.0/export",
    params: {
      from_date,
      to_date,
      limit,
      event,
      where,
    },
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      authorization: `Basic ${SECRET}`,
    },
  };

  try {
    const data = await axios.request(options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.data;
  } catch (error) {
    console.log(error);
    return "";
  }
};
