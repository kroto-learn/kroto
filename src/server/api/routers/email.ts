import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import nodemailer from "nodemailer";
import ical from "ical-generator";
import type { RouterOutputs } from "@/utils/api";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  auth: {
    user: "kamal@kroto.in",
    pass: "0p9lhegi2q",
  },
});

export const emailRouter = createTRPCRouter({
  addUserEvent: protectedProcedure
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

      const mailOptions = mailOptionsBuilder(
        event,
        { ...creator, events: [], socialLinks: [] },
        ctx.session.user.email ?? ""
      );

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        return err;
      }
    }),
});

const mailOptionsBuilder = (
  event: RouterOutputs["event"]["getEvent"],
  creator: RouterOutputs["creator"]["getPublicProfile"],
  recipientEmail: string
) => {
  const calendar = ical({
    name: "Kroto Event Calendar",
  });

  calendar.createEvent({
    start: event?.datetime,
    end: event?.endTime,
    summary: event?.title,
    description: event?.description,
    organizer: `${creator?.name ?? ""} <${creator?.email ?? ""}>`,
    location: event?.eventUrl ?? event?.eventLocation,
    url: `https://kroto.in/event/${event?.id ?? ""}`,
  });

  return {
    from: "kamal@kroto.in", // sender email
    to: recipientEmail, // recipient email
    subject: `Calendar Invite for ${event?.title ?? "Event"}`,
    text: "To add invites to the calendar of your preferrence, please open any of the following attachment and it will redirect you to the calendar invite page for your calendar app \n \n \n Thank your so much for registering to this event :)",
    icalEvent: {
      method: "REQUEST",
      content: calendar.toString(),
    },
  };
};
