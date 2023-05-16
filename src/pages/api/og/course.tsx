/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../../../public/Nunito-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(request: NextRequest) {
  try {
    const fontData = await font;
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has("title");
    const hasChapters = searchParams.has("chapters");
    const hasCreatorName = searchParams.has("creatorName");

    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "This is a cool course isn ittd ssfsf sdas";
    const chapters = hasChapters ? searchParams.get("chapters") : 1;
    const creatorName = hasCreatorName
      ? searchParams.get("creatorName")?.slice(0, 50)
      : "John Doe";
    return new ImageResponse(
      (
        <div tw="relative bg-neutral-800 w-full h-full flex flex-col items-center">
          <img
            width={300}
            height={425}
            src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682459626/design_1_svp04a.png"
            alt="design"
            tw="absolute left-[-10.7rem]"
          />
          <img
            width={123}
            height={424}
            src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682459799/design2_1_omqbi2.png"
            alt="design"
            tw="absolute right-0"
          />
          <div tw="flex flex-col items-center mt-4 mb-8">
            <p tw="text-neutral-200 p-0 m-0 text-lg mb-2 tracking-widest">
              LEARN ON
            </p>
            <img
              width={165}
              height={69}
              src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682458030/kroto-f-n-200_pl12tc.png"
              alt="Kroto"
            />
          </div>
          <div tw="max-h-[13rem] overflow-hidden px-48 flex">
            <h1 tw="tracking-wide font-bold text-6xl text-neutral-200 text-center uppercase">
              {title}
            </h1>
          </div>
          <div tw="my-12 max-w-xl h-1 w-full border-b border-neutral-200" />
          <div tw="flex w-full max-w-3xl justify-between items-center">
            <div tw="flex uppercase text-xl items-end text-neutral-200">
              <h4 tw="p-0 m-0 text-6xl tracking-widest">{chapters}</h4>
              <p tw="p-0 m-0 text-3xl tracking-widest pb-[0.17rem]">chapters</p>
            </div>
            <div tw="flex uppercase text-xl text-neutral-200">
              <h4 tw="p-0 m-0 text-3xl tracking-widest">{creatorName}</h4>
            </div>
          </div>
          <div tw="w-full absolute h-12 bottom-0 bg-pink-600" />
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "Nunito-Bold",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
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
