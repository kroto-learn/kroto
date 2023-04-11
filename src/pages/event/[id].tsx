import CalenderBox from "@/components/CalenderBox";
import Head from "next/head";
import Image from "next/image";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglemeet } from "react-icons/si";
import { GrTextAlignLeft } from "react-icons/gr";
import { IoPeopleOutline } from "react-icons/io5";

export default function EventPage() {
  const date = new Date("2023-06-22T01:30:00.000-05:00");

  const endTime = new Date(
    new Date("2023-06-22T01:30:00.000-05:00").getTime() + 3600000
  );

  return (
    <>
      <Head>
        <title>Web Development Bootcamp</title>
      </Head>
      <main className="flex h-full min-h-screen w-full flex-col items-center gap-8 overflow-x-hidden py-12">
        <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="relative h-[25rem] w-full">
            <Image
              src="https://res.cloudinary.com/dvisf70pm/image/upload/v1680159544/e7b7a422-4159-4f0e-8413-faafb869bd03_y9yatb.jpg"
              alt="Web Development Bootcamp"
              className="rounded-xl shadow-md shadow-black"
              fill
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-medium text-neutral-200">
                Web Development Bootcamp
              </h1>

              <div className="flex items-center gap-2">
                <div
                  className={`relative aspect-square w-[1.3rem] overflow-hidden rounded-full`}
                >
                  <Image
                    src="https://res.cloudinary.com/dvisf70pm/image/upload/v1680098256/1676536900360_gpwhyw.jpg"
                    alt="Rose Kamal Love"
                    fill
                  />
                </div>
                <p className={`text-sm text-neutral-300 transition-all`}>
                  Hosted by Rose Kamal Love
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <SiGooglemeet className="rounded-xl border border-neutral-500 bg-neutral-700 p-2 text-3xl text-neutral-400" />{" "}
                <p>Google Meet</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <CalenderBox date={new Date()} />
                <p className="text-left text-sm  font-medium text-neutral-300">
                  {date?.toLocaleString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  <br />
                  {date?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  to{" "}
                  {endTime?.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <button
                className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem]  py-2 text-center text-lg font-medium text-neutral-200 transition-all duration-300`}
              >
                Register now
                <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-3xl">
          <div className="flex w-full items-start gap-4">
            <div className="flex w-2/3 flex-col gap-4 rounded-xl bg-neutral-800">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <GrTextAlignLeft />
                <h2 className="font-medium ">Description</h2>
              </div>
              <p className="px-4 pb-4 text-neutral-300">
                In this bootcamp, you will learn the fundamentals of web
                development, which includes HTML, CSS, and JavaScript. You will
                learn how to create websites and web applications from scratch,
                including how to structure web pages with HTML, style them with
                CSS, and add interactivity and functionality with JavaScript.
                The bootcamp will also cover modern full stack development
                technologies, which include various tools, frameworks, and
                libraries used for building web applications. You will learn how
                to use front-end frameworks such as React, Angular, or Vue.js,
                which are used to create rich and dynamic user interfaces. You
                will also learn about back-end technologies such as Node.js,
                which is used to create server-side applications, and databases
                such as MongoDB and MySQL, which are used to store and manage
                data. Throughout the bootcamp, you will also learn best
                practices and techniques used by professional web developers to
                build scalable, maintainable, and high-performing web
                applications. You will learn how to use tools such as Git for
                version control, deploy your applications to cloud platforms
                like AWS, and work in a team environment using agile
                methodologies. By the end of the bootcamp, you will have a solid
                understanding of web development and full stack development
                concepts and will have built several web applications that
                demonstrate your skills and knowledge. You will be prepared to
                pursue a career as a web developer or continue learning more
                advanced topics in web development.
              </p>
            </div>
            <div className="flex w-1/3 flex-col gap-4 rounded-xl bg-neutral-800">
              <div className="flex items-center gap-2 border-b border-neutral-600 px-4 py-3 text-neutral-200">
                <IoPeopleOutline />
                <h2 className="font-medium ">Hosts</h2>
              </div>
              <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`relative aspect-square w-[1.7rem] overflow-hidden rounded-full`}
                  >
                    <Image
                      src="https://res.cloudinary.com/dvisf70pm/image/upload/v1680098256/1676536900360_gpwhyw.jpg"
                      alt="Rose Kamal Love"
                      fill
                    />
                  </div>
                  <p className={`text-neutral-300 transition-all`}>
                    Rose Kamal Love
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
