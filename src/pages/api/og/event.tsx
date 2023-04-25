/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
// import Image from "next/image";
// import ogdesign from "public/og-design.png";

export const config = {
  runtime: "edge",
};

// const font = fetch(
//   new URL(
//     "https://res.cloudinary.com/dvisf70pm/raw/upload/v1682458188/Nunito-VariableFont_wght_jkpe13.ttf",
//     import.meta.url
//   )
// ).then((res) => res.arrayBuffer());

// eslint-disable-next-line import/no-anonymous-default-export
export default function handler(request: NextRequest) {
  try {
    // const fontData = await font;
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has("title");
    const hasDateTime = searchParams.has("datetime");
    const hasHost = searchParams.has("host");

    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "This is a cool event very very cool event it is";
    const datetime = hasDateTime
      ? new Date(searchParams.get("datetime") ?? 1682439468000)
      : new Date(1682439468000);
    const host = hasHost ? searchParams.get("host")?.slice(0, 50) : "John Doe";
    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            background: "#171717",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            width={300}
            height={425}
            src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682459626/design_1_svp04a.png"
            alt="design"
            style={{
              position: "absolute",
              left: "-10.7rem",
            }}
          />
          <img
            width={123}
            height={424}
            src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682459799/design2_1_omqbi2.png"
            alt="design"
            style={{
              position: "absolute",
              right: "0",
            }}
          />
          <div tw="flex flex-col items-center mt-4 mb-12">
            <p tw="text-neutral-200 p-0 m-0 mb-2">JOIN ON</p>
            <img
              width={138}
              height={57}
              src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682458030/kroto-f-n-200_pl12tc.png"
              alt="Kroto"
            />
          </div>
          <h1 tw="font-bold text-6xl text-neutral-200 px-48 text-center uppercase">
            {title}
          </h1>
          <div tw="my-12 max-w-xl h-1 w-full border-b border-neutral-200" />
          <div tw="flex w-full max-w-2xl justify-between items-center">
            <div tw="flex flex-col gap-2 uppercase text-xl text-neutral-200">
              <p tw="p-0 m-0">ON</p>
              <h4 tw="p-0 m-0 text-2xl">
                {datetime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <span tw="mx-2" />
                {datetime.toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h4>
            </div>
            <div tw="flex flex-col gap-2 uppercase text-xl text-neutral-200">
              <p tw="p-0 m-0">HOSTED BY</p>
              <h4 tw="p-0 m-0 text-2xl">{host}</h4>
            </div>
          </div>
          <div tw="w-full absolute h-12 bottom-0 bg-pink-600" />
        </div>
      ),
      {
        width: 1200,
        height: 600,
        // fonts: [
        //   {
        //     name: "Nunito",
        //     data: fontData,
        //     style: "normal",
        //   },
        // ],
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    console.log(`${e?.message}`);

    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
