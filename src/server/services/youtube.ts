import { env } from "@/env.mjs";
const { YOUTUBE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;
import { google } from "googleapis";

const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export const searchYoutubePlaylistsService = async ({
  searchQuery,
  accessToken,
}: {
  searchQuery: string;
  accessToken: string;
}) => {
  try {
    auth.setCredentials({
      access_token: accessToken,
    });

    const yt = google.youtube({ version: "v3", auth });

    const searchParams = {
      part: ["snippet", "status", "contentDetails"],
      maxResults: 10,
      mine: true,
      q: searchQuery,
      type: "playlist",
    };

    const res = await yt.playlists.list({
      ...searchParams,
    });

    if (res && res.status === 200 && res?.data?.items) {
      return res.data.items
        .filter(
          (item) =>
            item?.status?.privacyStatus === "public" ||
            item?.status?.privacyStatus === "unlisted"
        )
        .filter((item) => {
          return (
            item?.snippet?.title
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item?.snippet?.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        })
        .map((item) => ({
          title: item?.snippet?.title,
          thumbnail: item?.snippet?.thumbnails?.high?.url,
          playlistId: item.id,
          channelTitle: item?.snippet?.channelTitle,
          videoCount: item?.contentDetails?.itemCount,
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
    id: [id],
    part: ["snippet"],
    key: YOUTUBE_API_KEY,
  };

  try {
    const yt = google.youtube({ version: "v3" });
    // Send request for playlist details
    const res = await yt.playlists.list(playlistDetailsConfig);

    if (!res || res.status !== 200) {
      console.log("error in getting playlist details!", res?.data);
      return null;
    }

    if (!res?.data?.items || !res?.data?.items[0]) return null;

    const playlistTitle: string = res?.data?.items[0]?.snippet?.title ?? "";
    const playlistDescription: string =
      res?.data?.items[0]?.snippet?.description ?? "";
    const playlistThumbnail: string =
      res?.data?.items[0]?.snippet?.thumbnails?.high?.url ?? "";

    // Define playlist items request config
    const playlistItemsConfig = {
      playlistId: id,
      part: ["snippet"],
      key: YOUTUBE_API_KEY,
      maxResults: 50,
    };

    // Send request for playlist items
    let piRes = await yt.playlistItems.list(playlistItemsConfig);

    if (!piRes || piRes.status !== 200) {
      console.log("error in getting playlist items!", piRes?.data);
      return null;
    }

    const allVidoes: {
      title: string;
      thumbnail: string;
      videoUrl: string;
      ytId: string;
    }[] = [];

    while (piRes) {
      // Do something with the results on this page
      piRes?.data?.items
        ? piRes?.data?.items?.forEach((video) => {
            const videoTitle = video?.snippet?.title ?? "";
            const videoThumbnail = video?.snippet?.thumbnails?.high?.url ?? "";
            const videoUrl = `https://www.youtube.com/watch?v=${
              video?.snippet?.resourceId?.videoId ?? ""
            }`;
            const ytId = video?.snippet?.resourceId?.videoId ?? "";

            allVidoes.push({
              title: videoTitle,
              thumbnail: videoThumbnail,
              videoUrl,
              ytId,
            });
          })
        : [];

      // Check if there are more pages
      if (piRes?.data?.nextPageToken) {
        // Request the next page of results
        const requestNextPage = await yt.playlistItems.list({
          ...playlistItemsConfig,
          pageToken: piRes?.data?.nextPageToken,
        });
        piRes = requestNextPage;
      } else {
        // No more pages, end the loop
        break;
      }
    }

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      videos: allVidoes,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getVideoDataService = async (id: string) => {
  try {
    const yt = google.youtube({ version: "v3" });
    const videoRes = await yt.videos.list({
      part: ["snippet"],
      id: [id],
      key: YOUTUBE_API_KEY,
    });

    if (
      videoRes &&
      videoRes.status === 200 &&
      videoRes?.data?.items &&
      videoRes?.data?.items[0]
    ) {
      return videoRes?.data?.items[0]?.snippet as { description: string };
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
