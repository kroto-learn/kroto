import nodemailer from "nodemailer";
import { env } from "@/env.mjs";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const cronTestRouter = createTRPCRouter({
  test: publicProcedure.query(async () => {
    const transporter = nodemailer.createTransport({
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 465,
      secure: true,
      auth: {
        user: env.SES_SMTP_USERNAME,
        pass: env.SES_SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "kamal@kroto.in",
      to: "rosekamallove@gmail.com",
      subject: "Hello",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    return "Hello World!";
  }),
});
