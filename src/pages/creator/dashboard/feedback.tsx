import Head from "next/head";
import Carousel from "react-multi-carousel";
import ImageWF from "@/components/ImageWF";
import "react-multi-carousel/lib/styles.css";
import { api } from "@/utils/api";

export default function Contact() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      partialVisibilityGutter: 60,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
      partialVisibilityGutter: 20,
    },
  };

  const { data: creator } = api.creator.getProfile.useQuery();

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="flex h-80 w-full justify-center">
        <div className=" w-2/4 bg-neutral-800 p-5">
          <Carousel className="" partialVisible={true} responsive={responsive}>
            <div className="flex gap-2">
              <div className="">
                <ImageWF
                  className="rounded-full dark:border-gray-800"
                  src={creator?.image ?? ""}
                  alt="random"
                  width={300}
                  height={300}
                />
              </div>
              <div>
                <p className="font-bold">{creator?.name ?? ""}</p>
                <p className="text-xs text-neutral-400">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="">
                <ImageWF
                  className="rounded-full dark:border-gray-800"
                  src={creator?.image ?? ""}
                  alt="random"
                  width={300}
                  height={300}
                />
              </div>
              <div>
                <p className="font-bold">{creator?.name ?? ""}</p>
                <p className="text-xs text-neutral-400">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="">
                <ImageWF
                  className="rounded-full dark:border-gray-800"
                  src={creator?.image ?? ""}
                  alt="random"
                  width={300}
                  height={300}
                />
              </div>
              <div>
                <p className="font-bold">{creator?.name ?? ""}</p>
                <p className="text-xs text-neutral-400">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum
                </p>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </>
  );
}
