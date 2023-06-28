import ical from "ical-generator";
import type { RouterOutputs } from "@/utils/api";
import { type Event } from "@prisma/client";
import showdown from "showdown";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import fs from "fs";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import { render } from "@react-email/render";
import LearningReminderEmail from "react-email-starter/emails/learning-reminder";

import AWS from "aws-sdk";
import LearningReportEmail from "react-email-starter/emails/learning-report";

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
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 465,
  secure: true,
  auth: {
    user: env.SES_SMTP_USERNAME,
    pass: env.SES_SMTP_PASSWORD,
  },
});

const SES_CONFIG = {
  accessKeyId: env.SES_ACCESS_KEY,
  secretAccessKey: env.SES_SECRET_KEY,
  region: "us-east-1",
};

const AWS_SES = new AWS.SES(SES_CONFIG);

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

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: [email],
    }, // recipient email
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
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

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: email,
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendEventStarted = async (event: Event, email: string[]) => {
  const data = {
    title: event?.title ?? "",
    heading: `${event?.title ?? "Event"} has started 🥳`,
    content: `
  <p>Hi,</p>
  <p>Thank you for registering to <a href=https://kroto.in/event/${
    event?.id ?? ""
  }>${event?.title ?? "this event"}</a>. We are glad to have you here. </p>
  <p>Then event has started. Please join the event by clicking on the link below</p>
  <a href=https://kroto.in/event/${event?.eventUrl ?? ""}>Join Event</a>
`,
  };

  const html = template(data);

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: email,
    }, // recipient email
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: `${event?.title ?? "Event"} has started party 🥳`,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
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

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: [email],
    }, // recipient email
    ReplyToAddresses: [creator?.email ?? ""],
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: `Registration confirmation for ${event?.title ?? "Event"}`,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
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
      </br>
      </br>
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

const sendContactus = async (contact: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const converter = new showdown.Converter();
  const bodyHtml = converter.makeHtml(
    `Name: ${contact.name}<br/>Email: ${contact.email}<br/>Phone: ${
      contact.phone ?? ""
    }<br/>Message:<br/>${contact.message}`
  );

  const subject = `Contact request from ${contact.name}`;

  const data = {
    title: subject,
    heading: subject,
    content: bodyHtml,
  };

  const html = template(data);

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: ["kamal@kroto.in"],
    }, // recipient email
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const sendClaimCourseRequest = async (request: {
  email: string;
  courseId: string;
}) => {
  const converter = new showdown.Converter();
  const bodyHtml = converter.makeHtml(
    `Email: ${request.email}<br/>CourseId: ${request.courseId}`
  );

  const subject = `Course Claim request from ${request.email}`;

  const data = {
    title: subject,
    heading: subject,
    content: bodyHtml,
  };

  const html = template(data);

  const mailOptions: AWS.SES.SendEmailRequest = {
    Source: "kamal@kroto.in", // sender email
    Destination: {
      ToAddresses: ["kamal@kroto.in"],
    }, // recipient email
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };

  try {
    await AWS_SES.sendEmail(mailOptions).promise();
  } catch (err) {
    if (err instanceof Error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
};

const dailyReminderNotLearned = async ({
  name,
  email,
  courseId,
  courseName,
}: {
  name: string;
  email: string;
  courseId: string;
  courseName: string;
}) => {
  const data = {
    name,
    courseUrl: `https://kroto.in/course/play/${courseId}`,
    courseName,
  };

  // const html = reminderTemplate(data);

  const emailHtml = render(<LearningReminderEmail {...data} />);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: "You're falling behind!",
    html: emailHtml,
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

const dailyLearningReport = async ({
  name,
  email,
  courseId,
  courseName,
  chsWatched,
  minutes,
  prevMinutes,
  streak,
}: {
  name: string;
  email: string;
  courseId: string;
  courseName: string;
  chsWatched: number;
  minutes: number;
  prevMinutes: number;
  streak: number;
}) => {
  const data = {
    name,
    chsWatched,
    minsLearned: minutes,
    courseUrl: `https://kroto.in/course/play/${courseId}`,
    courseName,
    prevMinutes,
    streak,
  };

  const emailHtml = render(<LearningReportEmail {...data} />);

  const mailOptions = {
    from: "kamal@kroto.in", // sender email
    to: email, // recipient email
    subject: "Your learning report is here!",
    html: emailHtml,
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
  sendContactus,
  dailyLearningReport,
  dailyReminderNotLearned,
  sendClaimCourseRequest,
};
