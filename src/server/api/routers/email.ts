import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import nodemailer from "nodemailer";
import ical from "ical-generator";
import fs from "fs";
import tailwindcss from "tailwindcss";
import type { RouterOutputs } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import postcss from "postcss";
import handlebars from "handlebars";

import tailwindConfig from "../../../../tailwind.config.cjs";
const tailwind = postcss(tailwindcss({ config: tailwindConfig })).process(
  ""
).css;

const templateSource = fs.readFileSync(
  `${process.cwd()}/templates/base.hbs`,
  "utf8"
);
const template = handlebars.compile(templateSource);

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  auth: {
    user: "kamal@kroto.in",
    pass: "0p9lhegi2q",
  },
});

export const emailRouter = createTRPCRouter({
  sendCalendarInvite: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });
      const creator = await prisma.user.findUnique({
        where: {
          id: event?.creatorId,
        },
      });

      if (!event || !creator) throw new Error("Event or creator not found");

      const mailOptions = calendarInviteOptions(
        event,
        { ...creator, events: [], socialLinks: [] },
        ctx.session.user.email ?? ""
      );

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        if (err instanceof Error)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
          });
      }
    }),
});

const calendarInviteOptions = (
  event: RouterOutputs["event"]["getEvent"],
  creator: RouterOutputs["creator"]["getPublicProfile"],
  recipientEmail: string
) => {
  const calendar = ical({
    name: "Kroto Event Calendar",
  });

  console.log(tailwind);

  calendar.createEvent({
    start: event?.datetime,
    end: event?.endTime,
    summary: event?.title,
    description: event?.description,
    organizer: `${creator?.name ?? ""} <${creator?.email ?? ""}>`,
    location: event?.eventUrl ?? event?.eventLocation,
    url: `https://kroto.in/event/${event?.id ?? ""}`,
  });

  const data = {
    title: event?.title ?? "",
    heading: `Calendar invite for ${event?.title ?? "Event"}`,
    content: `To add invites to the calendar of your preferrence, please open any of the <b>following attachment</b> 
      and it will redirect you to the calendar invite page for your calendar app \n \n \n 
      Thank your so much for registering to <a href=https://kroto.in/event/${
        event?.id ?? ""
      }>${event?.title ?? "this event"}</a> :)`,
    tailwind,
  };
  const html = template(data);

  return {
    from: "kamal@kroto.in", // sender email
    to: recipientEmail, // recipient email
    subject: `Calendar Invite for ${event?.title ?? "Event"}`,
    html: html,
    icalEvent: {
      method: "REQUEST",
      content: calendar.toString(),
    },
  };
};
