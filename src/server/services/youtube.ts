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
        .map((item) => ({
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          playlistId: item.id,
          channelTitle: item.snippet.channelTitle,
          videoCount: item.contentDetails.itemCount,
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
    const playlistDetailsResponse: {
      data: {
        items: {
          snippet: {
            title: string;
            description: string;
            thumbnails: { high: { url: string } };
          };
        }[];
      };
    } = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      playlistDetailsConfig
    );

    if (!playlistDetailsResponse.data.items[0]) return null;

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
    const playlistItemsResponse: {
      data: {
        items: {
          snippet: {
            title: string;
            thumbnails: { high: { url: string } };
            resourceId: { videoId: string };
          };
        }[];
      };
    } = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      playlistItemsConfig
    );

    const videos: {
      title: string;
      thumbnail: string;
      videoUrl: string;
      ytId: string;
    }[] = playlistItemsResponse?.data?.items?.map((video) => {
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
