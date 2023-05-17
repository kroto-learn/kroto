/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const fontMedium = fetch(
  new URL("../../../../public/Nunito-Medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontBold = fetch(
  new URL("../../../../public/Nunito-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontBlack = fetch(
  new URL("../../../../public/Nunito-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(request: NextRequest) {
  try {
    const [fontMediumData, fontBoldData, fontBlackData] = await Promise.all([
      fontMedium,
      fontBold,
      fontBlack,
    ]);
    const { searchParams } = new URL(request.url);
    const hasName = searchParams.has("name");
    const hasImage = searchParams.has("image");
    const hasCreatorProfile = searchParams.has("creatorProfile");

    const name = hasName ? searchParams.get("name") : "John Doe";
    const image = hasImage
      ? searchParams.get("image")
      : "https://res.cloudinary.com/dvisf70pm/image/upload/v1677869350/characters/0d822cc58bf00ddca38ea288b08a6bed_ymlade.jpg";

    const creatorProfile = hasCreatorProfile
      ? searchParams.get("creatorProfile")
      : "johndoe";

    return new ImageResponse(
      (
        <div tw="relative bg-neutral-800 w-full h-full flex flex-col items-center font-bold">
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
          <div tw="flex max-w-4xl h-[80%] justify-start items-center">
            <img
              width={300}
              height={300}
              src={image ?? ""}
              alt={name ?? ""}
              tw="rounded-full aspect-square mr-12 border-8 border-pink-600"
            />
            <div tw="flex flex-col items-start">
              <div tw="max-w-[34rem] overflow-hidden flex items-start">
                <h1 tw="tracking-wide text-5xl text-neutral-200 font-black uppercase">
                  {name}
                </h1>
              </div>
              <div tw="flex items-center mt-4 mb-8">
                <p tw="text-neutral-200 p-0 m-0 text-2xl mb-2 mr-3 tracking-widest">
                  LEARN WITH ME ON
                </p>
                <img
                  width={97}
                  height={42}
                  src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682458030/kroto-f-n-200_pl12tc.png"
                  alt="Kroto"
                  tw="p-0 m-0 mb-2"
                />
              </div>
            </div>
          </div>

          <div tw="absolute bottom-12 p-4 w-full border-t border-neutral-200 flex items-center justify-center">
            <img
              width={25}
              height={30}
              src="https://res.cloudinary.com/dvisf70pm/image/upload/v1682524994/kroto-logo-n-200_mjkjnp.png"
              alt="Kroto"
              tw="mr-1 mt-2"
            />
            <p tw="p-0 m-0 tracking-widest text-3xl text-neutral-200 font-medium">{`roto.in/${
              creatorProfile ?? ""
            }`}</p>
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
            data: fontMediumData,
            style: "normal",
            weight: 500,
          },
          {
            name: "Nunito",
            data: fontBoldData,
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
