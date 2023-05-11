import { type ImageResponse } from "@vercel/og";
import axios, { type AxiosResponse } from "axios";

export const generateStaticCreatorOgImage = async ({
  ogUrl,
  name,
  creatorProfile,
  image,
}: {
  ogUrl: string;
  creatorProfile: string;
  image: string;
  name: string;
}) => {
  try {
    const ogImageRes = await axios({
      url: ogUrl,
      responseType: "arraybuffer",
      params: {
        name,
        creatorProfile,
        image,
      },
    });
    return ogImageRes as AxiosResponse<ImageResponse>;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const generateStaticEventOgImage = async ({
  ogUrl,
  title,
  host,
  datetime,
}: {
  ogUrl: string;
  host: string;
  datetime: Date;
  title: string;
}) => {
  try {
    const ogImageRes = await axios({
      url: ogUrl,
      responseType: "arraybuffer",
      params: {
        title,
        datetime: datetime.getTime(),
        host,
      },
    });
    return ogImageRes as AxiosResponse<ImageResponse>;
  } catch (err) {
    console.log(err);
    return null;
  }
};
