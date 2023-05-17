/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../../../public/Nunito-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontBlack = fetch(
  new URL("../../../../public/Nunito-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(request: NextRequest) {
  try {
    const fontData = await font;
    const fontBlackData = await fontBlack;

    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has("title");
    const hasThumbnail = searchParams.has("thumbnail");
    const hasChapters = searchParams.has("chapters");
    const hasCreatorName = searchParams.has("creatorName");

    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "This is a cool course isn ittd ssfsf sdas";
    const thumbnail = hasThumbnail
      ? searchParams.get("thumbnail")
      : "https://i.ytimg.com/vi/GdrzyZ2E1dA/hqdefault.jpg";
    const chapters = hasChapters ? searchParams.get("chapters") : 1;
    const creatorName = hasCreatorName
      ? searchParams.get("creatorName")?.slice(0, 50)
      : "John Doe";
    return new ImageResponse(
      (
        <div tw="relative bg-neutral-800 font-bold w-full h-full flex flex-col items-center">
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
          <div tw="flex items-center mt-4 mb-8">
            <p tw="text-neutral-200 p-0 m-0 text-lg mr-2 tracking-widest">
              LEARN ON
            </p>
            <img
              width={165}
              height={69}
              src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682458030/kroto-f-n-200_pl12tc.png"
              alt="Kroto"
            />
          </div>
          <div
            style={{
              boxShadow: "-8px 8px 0px 0px rgba(219,39,119,1)",
            }}
            tw="flex items-center mb-8 rounded-xl relative h-[150px] w-[267px] overflow-hidden border-2 border-pink-600"
          >
            <img
              src={thumbnail ?? ""}
              alt={title ?? ""}
              tw="w-full absolute object-cover"
            />
          </div>

          <div tw="max-h-[13rem] overflow-hidden px-48 flex">
            <h1 tw="tracking-wide font-black text-5xl text-neutral-200 text-center uppercase">
              {title}
            </h1>
          </div>
          <div tw="flex w-full absolute bottom-12 p-4 border-t border-neutral-300 justify-center items-center">
            <div tw="w-full max-w-3xl flex items-center justify-between">
              <div tw="flex uppercase text-xl items-end text-neutral-200">
                <h4 tw="p-0 m-0 text-3xl tracking-widest">
                  {chapters} chapters
                </h4>
              </div>
              <div tw="flex uppercase text-xl text-neutral-200">
                <h4 tw="p-0 m-0 text-3xl tracking-widest">{creatorName}</h4>
              </div>
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
            name: "Nunito",
            data: fontData,
            style: "normal",
            weight: 700,
          },
          {
            name: "Nunito",
            data: fontBlackData,
            style: "normal",
            weight: 900,
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
