import Head from "next/head";
import Carousel from "react-multi-carousel";
import ImageWF from "@/components/ImageWF";
import "react-multi-carousel/lib/styles.css";
import { api } from "@/utils/api";
import { StarIcon } from "@heroicons/react/20/solid";

export default function Contact() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  const { data: creator } = api.creator.getProfile.useQuery();

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="flex max-h-80 w-full justify-center">
        <div className="w-full p-5">
          <Carousel
            className=""
            centerMode={true}
            infinite={true}
            responsive={responsive}
          >
            <div className="flex w-full justify-center">
              <div className="row flex max-h-80 w-11/12 gap-2 overflow-y-scroll  rounded-lg bg-neutral-800 p-4 md:w-3/4 lg:w-3/5">
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
                  <div className="flex justify-between">
                    <p className="text-sm font-bold sm:text-lg">
                      {creator?.name ?? ""}
                    </p>
                    <div className="flex">
                      <StarIcon className="w-4 pb-1 text-yellow-400 sm:w-5" />
                      <p className="text-sm font-bold sm:text-lg">8.5</p>
                    </div>
                  </div>
                  <p className=" py-2 text-xs font-semibold text-neutral-400">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-5">
              <div className="flex max-h-80 w-11/12 gap-2 overflow-y-scroll rounded-lg bg-neutral-800 p-4 md:w-3/4 lg:w-3/5">
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
                  <div className="flex justify-between">
                    <p className="text-sm font-bold sm:text-lg">
                      {creator?.name ?? ""}
                    </p>
                    <div className="flex">
                      <StarIcon className="w-4 pb-1 text-yellow-400 sm:w-5" />
                      <p className="text-sm font-bold sm:text-lg">8.5</p>
                    </div>
                  </div>
                  <p className="py-2 text-xs font-semibold text-neutral-400">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex max-h-80 w-11/12 gap-2 overflow-y-scroll rounded-lg bg-neutral-800 p-4 md:w-3/4 lg:w-3/5">
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
                  <div className="flex justify-between">
                    <p className="text-sm font-bold sm:text-lg">
                      {creator?.name ?? ""}
                    </p>
                    <div className="flex">
                      <StarIcon className="w-4 pb-1 text-yellow-400 sm:w-5" />
                      <p className="text-sm font-bold sm:text-lg">8.5</p>
                    </div>
                  </div>
                  <p className="py-2 text-xs font-semibold text-neutral-400">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex max-h-80 w-11/12 gap-2 overflow-y-scroll rounded-lg bg-neutral-800 p-4 md:w-3/4 lg:w-3/5">
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
                  <div className="flex justify-between">
                    <p className="text-sm font-bold sm:text-lg">
                      {creator?.name ?? ""}
                    </p>
                    <div className="flex">
                      <StarIcon className="w-4 pb-1 text-yellow-400 sm:w-5" />
                      <p className="text-sm font-bold sm:text-lg">8.5</p>
                    </div>
                  </div>
                  <p className="py-2 text-xs font-semibold text-neutral-400">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </>
  );
}
