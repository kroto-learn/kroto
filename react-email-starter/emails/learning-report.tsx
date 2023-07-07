import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
  name: string;
  courseName: string;
  courseUrl: string;
  chsWatched: number;
  minsLearned: number;
  prevMinutes: number;
  streak: number;
};
export const LearningReportEmail = ({
  name,
  courseName,
  courseUrl,
  chsWatched,
  minsLearned,
  prevMinutes,
  streak,
}: Props) => {
  const diff = prevMinutes
    ? ((minsLearned - prevMinutes) / prevMinutes) * 100
    : undefined;

  // something

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Html className="w-full">
        <Head />
        <Preview>Hello {name}, here&apos;s your daily learning report.</Preview>
        <Body className="w-full" style={main}>
          <Container className="w-full" style={container}>
            <Section className="w-full" style={box}>
              <Img
                src={`https://www.kroto.in/kroto-f.png`}
                width="85"
                height="40"
                alt="Kroto"
                className="mx-auto my-8"
              />
              <Container className="w-full bg-neutral-900 p-4">
                <Text className="mx-auto mb-8 text-center text-4xl">
                  {"📈"}
                </Text>
                <Text className="mx-auto text-center text-2xl text-white">
                  Your learning report is here!
                </Text>
              </Container>
              <Container className="px-8 py-2">
                <Text style={paragraph}>Hello {name}</Text>
                <Text style={paragraph}>
                  Here&apos;s your daily learning report:
                </Text>
                <table className="m-0 p-0">
                  <thead>
                    <th>
                      <tr>
                        <td className="pr-32">
                          <Text className="m-0 p-0 text-sm uppercase tracking-wider">
                            {"📖"} Chapters watched
                          </Text>
                        </td>
                        <td>
                          <Text className="m-0 p-0 text-sm uppercase tracking-wider">
                            {"⌛"} Minutes learned
                          </Text>
                        </td>
                      </tr>
                    </th>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <Text className="m-0 p-0 font-black text-pink-600">
                          <span className="m-0 p-0 text-4xl">{chsWatched}</span>{" "}
                          chapter{chsWatched > 1 ? "s" : ""}
                        </Text>
                      </td>

                      <td>
                        <Text className="m-0 p-0 font-black text-pink-600">
                          <span className="m-0 p-0 text-4xl">
                            {minsLearned}
                          </span>{" "}
                          minute{minsLearned > 1 ? "s" : ""}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                  <tr>
                    <td>
                      <Container className="h-8" />
                    </td>
                  </tr>
                  <thead>
                    <th>
                      <tr>
                        <td>
                          <Text className="m-0 p-0 text-sm uppercase tracking-wider">
                            {"🗓️"} Yesterday&apos;s comparison
                          </Text>
                        </td>
                        <td>
                          <Text className="m-0 p-0 text-sm uppercase tracking-wider">
                            {"⚡"} Learning Streak
                          </Text>
                        </td>
                      </tr>
                    </th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Text
                          className={`m-0 p-0 font-black ${
                            diff && diff < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          <span className="text-4xl">
                            {diff
                              ? (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%"
                              : `${minsLearned}`}
                          </span>
                          {diff
                            ? diff >= 0
                              ? " more"
                              : " less"
                            : `minute${minsLearned > 1 ? "s" : ""} more`}
                          {" learned"}
                        </Text>
                      </td>

                      <td>
                        <Text className="m-0 p-0 font-black text-pink-600">
                          <span className="text-4xl"> {streak}</span> day
                          {streak > 1 ? "s" : ""}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Text style={paragraph}>
                  View your detailed learning report on your
                  <Link
                    href="https://www.kroto.in/dashboard"
                    className="underline-none mx-1 font-semibold text-pink-500 hover:text-pink-600"
                  >
                    Kroto dashboard
                  </Link>
                  .
                </Text>

                <Text style={paragraph}>
                  Keep up with your learning & continue learning the
                  <Link
                    href={courseUrl}
                    className="underline-none mx-1 font-semibold text-pink-500 hover:text-pink-600"
                  >
                    {courseName}
                  </Link>
                  course.
                </Text>
                <Button
                  pX={10}
                  pY={10}
                  style={button}
                  className="cursor-pointer bg-pink-500 hover:bg-pink-600"
                  href={courseUrl}
                >
                  Continue Learning
                </Button>
                <Hr style={hr} />

                <Text style={paragraph}>
                  If you get stuck some where in your course, you can{" "}
                  <Link
                    href="https://www.kroto.in/book-doubt-session"
                    className="underline-none font-semibold text-pink-500 hover:text-pink-600"
                  >
                    book a free doubt resolving session
                  </Link>{" "}
                  with our experts on Kroto.
                </Text>
                <Button
                  pX={10}
                  pY={10}
                  style={button}
                  className="cursor-pointer bg-pink-500 hover:bg-pink-600"
                  href="https://www.kroto.in/book-doubt-session"
                >
                  Book a free session now!
                </Button>
                <Hr style={hr} />

                <Text style={paragraph}>
                  If you have any queries regarding our services or our
                  platform, then reply to this email or get in touch with us on
                  our{" "}
                  <Link
                    className="underline-none font-semibold text-pink-500 hover:text-pink-600"
                    href="https://kroto.in/contact-us"
                  >
                    contact page
                  </Link>
                  .
                </Text>
                <Text style={paragraph}>— Rose Kamal Love (CEO @ Kroto)</Text>
              </Container>

              <Container className="w-full p-3 text-neutral-400">
                <Hr style={hr} />
                <Link href="https://kroto.in" className="mx-auto">
                  <Img
                    src="https://kroto.in/kroto-logo-p.png"
                    width="35"
                    alt="Kroto"
                    className="mx-auto"
                  />
                </Link>

                <Text className="m-0 my-2 p-0 text-center">
                  <Link
                    className="mr-4 inline cursor-pointer"
                    href="https://twitter.com/RoseKamalLove1"
                  >
                    <Img
                      src="https://kroto.in/twitter-p.png"
                      width="28"
                      alt="Twitter"
                      className="inline"
                    />
                  </Link>
                  <Link
                    className="inline cursor-pointer"
                    href="https://discord.com/invite/e5SnnVP3ad"
                  >
                    <Img
                      src="https://kroto.in/discord-p.png"
                      width="28"
                      alt="Discord"
                      className="inline"
                    />
                  </Link>
                </Text>
                <Container className="mx-auto">
                  <Text className="m-0 mb-2 p-0 text-center text-sm">
                    Created by
                    <span className="ml-1 font-semibold">
                      Kroto Kreator Labs
                    </span>
                  </Text>
                  <Text className="m-0 mb-2 p-0 text-center text-xs">
                    <Link
                      className="mx-1 cursor-pointer text-pink-500"
                      href="https://www.kroto.in/info/terms-of-service"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      className="mx-1 cursor-pointer text-pink-500"
                      href="https://www.kroto.in/privacy"
                    >
                      Privacy Policy
                    </Link>
                  </Text>
                  <Text className="m-0 p-0 text-center text-xs">
                    &copy;2023 Kroto Kreator Labs Pvt. Ltd., All rights
                    reserved.
                  </Text>
                </Container>
              </Container>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default LearningReportEmail;

LearningReportEmail.defaultProps = {
  courseName: "Web Development Course",
  chsWatched: 0,
  minsLearned: 5,
  streak: 1,
  prevMinutes: 2,
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "64px",
};

const box = {};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  width: "100%",
};
