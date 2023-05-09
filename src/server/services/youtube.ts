import axios from "axios";
import { env } from "@/env.mjs";
const { YOUTUBE_API_KEY } = env;

const apiEndpoint = "https://www.googleapis.com/youtube/v3/playlists";

export const searchYoutubePlaylistsService = async ({
  searchQuery,
  accessToken,
}: {
  searchQuery: string;
  accessToken: string;
}) => {
  try {
    const res = await axios.get(apiEndpoint, {
      params: {
        part: "snippet,status,contentDetails",
        maxResults: 10,
        mine: true,
        q: searchQuery,
        key: YOUTUBE_API_KEY,
        type: "playlist",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res && res.status === 200) {
      return (
        res as {
          data: {
            items: {
              status: { privacyStatus: string };
              snippet: {
                title: string;
                thumbnails: { high: { url: string } };
                channelTitle: string;
                description: string;
              };
              id: string;
              contentDetails: { itemCount: number };
            }[];
          };
        }
      ).data.items
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
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          playlistId: item.id,
          channelTitle: item.snippet.channelTitle,
          videoCount: item.contentDetails.itemCount,
        }));
    } else {
      console.log("Error in getting youtube playlists", res);
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
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      playlistDetailsConfig
    );

    if (!res || res.status !== 200) {
      console.log("error in getting playlist details!", res?.data);
      return null;
    }

    const successRes: {
      data: {
        items: {
          snippet: {
            title: string;
            description: string;
            thumbnails: { high: { url: string } };
          };
        }[];
      };
    } = res;

    if (!successRes.data.items[0]) return null;

    const playlistTitle: string = successRes.data.items[0].snippet.title;
    const playlistDescription: string =
      successRes.data.items[0].snippet.description;
    const playlistThumbnail: string =
      successRes.data.items[0].snippet.thumbnails.high.url;

    // Define playlist items request config
    const playlistItemsConfig = {
      params: {
        playlistId: id,
        part: "snippet",
        key: YOUTUBE_API_KEY,
      },
    };

    // Send request for playlist items
    const piRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      playlistItemsConfig
    );

    if (!piRes || piRes.status !== 200) {
      console.log("error in getting playlist items!", piRes?.data);
      return null;
    }

    const successPiRes: {
      data: {
        items: {
          snippet: {
            title: string;
            thumbnails: { high: { url: string } };
            resourceId: { videoId: string };
          };
        }[];
      };
    } = piRes;

    const videos: {
      title: string;
      thumbnail: string;
      videoUrl: string;
      ytId: string;
    }[] = successPiRes?.data?.items?.map((video) => {
      const videoTitle = video.snippet.title;
      const videoThumbnail = video.snippet.thumbnails.high.url;
      const videoUrl = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
      const ytId = video.snippet.resourceId.videoId;

      return {
        title: videoTitle,
        thumbnail: videoThumbnail,
        videoUrl,
        ytId,
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
