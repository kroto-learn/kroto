import ical from "ical-generator";
import type { RouterOutputs } from "@/utils/api";
import { type Event } from "@prisma/client";
import showdown from "showdown";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import fs from "fs";
import { TRPCError } from "@trpc/server";

const templateSource = fs.readFileSync(
  `${process.cwd()}/templates/base.hbs`,
  "utf8"
);
const registrationSource = fs.readFileSync(
  `${process.cwd()}/templates/registration.hbs`,
  "utf8"
);
const registration = handlebars.compile(registrationSource);
const template = handlebars.compile(templateSource);

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  auth: {
    user: "kamal@kroto.in",
    pass: "0p9lhegi2q",
  },
});

const sendUpdatePreview = async (
  subject: string,
  body: string,
  email: string
) => {
  const converter = new showdown.Converter();
  const bodyHtml = converter.makeHtml(body);

  const data = {
    title: subject,
    heading: `${subject}`,
    content: bodyHtml,
  };

  const html = template(data);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendEventUpdate = async (
  subject: string,
  body: string,
  email: string[]
) => {
  const converter = new showdown.Converter();
  const bodyHtml = converter.makeHtml(body);

  const data = {
    title: subject,
    heading: `${subject}`,
    content: bodyHtml,
  };

  const html = template(data);

  const mailOptions = {
    from: "rosekamallove@gmail.com", // sender email
    to: email, // recipient email
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendEventStarted = async (event: Event, email: string, name: string) => {
  const data = {
    title: event?.title ?? "",
    heading: `${event?.title ?? "Event"} has started 🥳`,
    content: `
  <p>Hi ${name},</p>
<p>Thank you for registering to <a href=https://kroto.in/event/${
      event?.id ?? ""
    }>${event?.title ?? "this event"}</a>. We are glad to have you here. </p>
<p>Then event has started. Please join the event by clicking on the link below</p>
<a href=https://kroto.in/event/${event?.eventUrl ?? ""}>Join Event</a>
`,
  };

  const html = template(data);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: `${event?.title ?? "Event"} has started 🥳`,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendRegistrationConfirmation = async (
  event: Event,
  creator: RouterOutputs["creator"]["getProfileNoLinks"],
  email: string,
  name: string
) => {
  const data = {
    title: event?.title ?? "",
    eventTitle: event?.title ?? "",
    eventUrl: `https://kroto.in/event/${event?.id ?? ""}`,
    creator: creator?.name ?? "",
    creatorProfile: `https://kroto.in/${creator?.id ?? ""}`,
    date: new Date(event?.datetime ?? ""),
    name: name,
  };

  const html = registration(data);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: `Registration confirmation for ${event?.title ?? "Event"}`,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendCalendarInvite = async (
  event: Event,
  creator: RouterOutputs["creator"]["getProfileNoLinks"],
  email: string
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

  const data = {
    title: event?.title ?? "",
    heading: `Calendar invite for ${event?.title ?? "Event"}`,
    content: `To add invites to the calendar of your preferrence, please open any of the <b>following attachment</b> 
      and it will redirect you to the calendar invite page for your calendar app \n \n \n 
      Thank your so much for registering to <a href=https://kroto.in/event/${
        event?.id ?? ""
      }>${event?.title ?? "this event"}</a> :)`,
  };

  const html = template(data);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: `Calendar Invite for ${event?.title ?? "Event"}`,
    html: html,
    icalEvent: {
      method: "REQUEST",
      content: calendar.toString(),
    },
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

export {
  sendUpdatePreview,
  sendCalendarInvite,
  sendRegistrationConfirmation,
  sendEventStarted,
  sendEventUpdate,
};
