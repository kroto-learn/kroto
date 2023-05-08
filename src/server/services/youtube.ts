/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import { env } from "@/env.mjs";
const { YOUTUBE_API_KEY } = env;

export const searchYoutubePlaylistsService = async ({
  searchQuery,
  accessToken,
}: {
  searchQuery: string;
  accessToken: string;
}) => {
  try {
    const apiEndpoint = "https://www.googleapis.com/youtube/v3/playlists";

    const res = await axios.get(apiEndpoint, {
      params: {
        part: "snippet,status,contentDetails",
        maxResults: 10,
        mine: true,
        key: YOUTUBE_API_KEY,
        type: "playlist",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("res", res.data.items);

    if (res && res.status === 200) {
      return (res.data.items as any[])
        .filter(
          (item) =>
            item.status.privacyStatus === "public" ||
            item.status.privacyStatus === "unlisted"
        )
        .filter((item) => {
          return (
            item.snippet.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.snippet.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        })
        .map((item) => ({
          title: item.snippet.title as string,
          thumbnail: item.snippet.thumbnails.high.url as string,
          playlistId: item.id as string,
          channelTitle: item.snippet.channelTitle as string,
          videoCount: item.contentDetails.itemCount as number,
        }));
    } else {
      console.log("something went wrong", res);
      return [];
    }
  } catch (err) {
    console.log("Error in getting youtube playlists", err);
    return [];
  }
};

export const getPlaylistDataService = async (id: string) => {
  const playlistDetailsConfig = {
    params: {
      id,
      part: "snippet",
      key: YOUTUBE_API_KEY,
    },
  };

  try {
    // Send request for playlist details
    const playlistDetailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      playlistDetailsConfig
    );

    const playlistTitle: string =
      playlistDetailsResponse.data.items[0].snippet.title;
    const playlistDescription: string =
      playlistDetailsResponse.data.items[0].snippet.description;
    const playlistThumbnail: string =
      playlistDetailsResponse.data.items[0].snippet.thumbnails.high.url;

    // Define playlist items request config
    const playlistItemsConfig = {
      params: {
        playlistId: id,
        part: "snippet",
        key: YOUTUBE_API_KEY,
      },
    };

    // Send request for playlist items
    const playlistItemsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      playlistItemsConfig
    );

    const videos: { title: string; thumbnail: string; videoUrl: string }[] =
      playlistItemsResponse?.data?.items?.map((video: any) => {
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${
          video.snippet.resourceId.videoId as string
        }`;

        return {
          title: videoTitle,
          thumbnail: videoThumbnail,
          videoUrl,
        };
      });

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      videos,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
