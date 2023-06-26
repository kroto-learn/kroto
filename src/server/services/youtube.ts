import { env } from "@/env.mjs";
const { YOUTUBE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;
import { google } from "googleapis";
import moment from "moment";

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

export const searchYoutubePlaylistsAdminService = async ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  try {
    const yt = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

    const searchParams = {
      part: ["snippet"],
      maxResults: 30,
      q: searchQuery,
      types: "playlist",
    };

    const res = await yt.search.list({
      ...searchParams,
    });

    if (res && res.status === 200 && res?.data?.items) {
      return res.data.items
        .filter((item) => item.id?.kind === "youtube#playlist")
        .map((item) => ({
          title: item?.snippet?.title,
          thumbnail: item?.snippet?.thumbnails?.high?.url,
          playlistId: item?.id?.playlistId,
          channelTitle: item?.snippet?.channelTitle,
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

export const getPlaylistDataShallowService = async (id: string) => {
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

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      id,
    };
  } catch (error) {
    console.log;
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
      part: ["snippet", "contentDetails"],
      key: YOUTUBE_API_KEY,
      maxResults: 50,
    };

    // Send request for playlist items
    let piRes = await yt.playlistItems.list(playlistItemsConfig);

    if (!piRes || piRes.status !== 200) {
      console.log("error in getting playlist items!", piRes?.data);
      return null;
    }

    const allVideos: {
      title: string;
      thumbnail: string;
      videoUrl: string;
      ytId: string;
      description: string;
      duration: number;
    }[] = [];

    // Extract the video IDs from the playlist items
    const videoIds = piRes?.data?.items?.map(
      (item) => item?.contentDetails?.videoId
    );

    // Send request for video details
    const vdRes = await yt?.videos.list({
      part: ["contentDetails"],
      id: videoIds as string[] | undefined,
      key: YOUTUBE_API_KEY,
    });

    if (!vdRes || vdRes.status !== 200) {
      console.log("error in getting video details!", vdRes?.data);
      return null;
    }

    while (piRes && vdRes) {
      // Do something with the results on this page

      piRes?.data?.items
        ? piRes?.data?.items
            ?.filter((video) => video?.snippet?.title !== "Deleted video")
            .forEach((video, index) => {
              const videoTitle = video?.snippet?.title ?? "";
              const videoThumbnail =
                video?.snippet?.thumbnails?.high?.url ?? "";
              const videoUrl = `https://www.youtube.com/watch?v=${
                video?.snippet?.resourceId?.videoId ?? ""
              }`;
              const ytId = video?.snippet?.resourceId?.videoId ?? "";
              const description = video?.snippet?.description ?? "";
              const duration =
                vdRes?.data?.items &&
                vdRes?.data?.items[index]?.contentDetails?.duration
                  ? Math.ceil(
                      moment
                        .duration(
                          vdRes?.data?.items[index]?.contentDetails?.duration
                        )
                        .asMinutes()
                    )
                  : 0;

              allVideos.push({
                title: videoTitle,
                thumbnail: videoThumbnail,
                videoUrl,
                ytId,
                description,
                duration,
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

        // Extract the video IDs from the new playlist items
        const newVideoIds = piRes?.data?.items?.map(
          (item) => item?.contentDetails?.videoId
        );

        // Send request for the video details on the new page
        const newVdRes = await yt.videos.list({
          part: ["contentDetails"],
          id: newVideoIds as string[],
          key: YOUTUBE_API_KEY,
        });

        vdRes.data.items = [
          ...(vdRes?.data?.items ?? []),
          ...(newVdRes.data.items ?? []),
        ];
      } else {
        // No more pages, end the loop
        break;
      }
    }

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      videos: allVideos,
    };
  } catch (error) {
    console.log;
  }
};

export const getPlaylistDataAdminService = async (id: string) => {
  const playlistDetailsConfig = {
    id: [id],
    part: ["snippet"],
    key: YOUTUBE_API_KEY,
  };

  try {
    console.log("reached here");

    const yt = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });
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
    const channelId: string = res?.data?.items[0]?.snippet?.channelId ?? "";

    console.log("pt data fetched");

    const channelRes = await yt.channels.list({
      part: ["snippet"],
      id: [channelId],
    });

    if (!channelRes || channelRes.status !== 200) {
      console.log("error in getting channel details!", channelRes?.data);
      return null;
    }

    if (!channelRes?.data?.items || !channelRes?.data?.items[0]) return null;

    const ytChannelId: string =
      channelRes?.data?.items[0]?.snippet?.customUrl ?? "";
    const ytChannelName: string =
      channelRes?.data?.items[0]?.snippet?.title ?? "";
    const ytChannelImage: string =
      channelRes?.data?.items[0]?.snippet?.thumbnails?.medium?.url ?? "";

    console.log("channel data fetched");

    // Define playlist items request config
    const playlistItemsConfig = {
      playlistId: id,
      part: ["snippet", "contentDetails"],
      key: YOUTUBE_API_KEY,
      maxResults: 50,
    };

    // Send request for playlist items
    let piRes = await yt.playlistItems.list(playlistItemsConfig);

    if (!piRes || piRes.status !== 200) {
      console.log("error in getting playlist items!", piRes?.data);
      return null;
    }

    const allVideos: {
      title: string;
      thumbnail: string;
      videoUrl: string;
      ytId: string;
      description: string;
      duration: number;
    }[] = [];

    // Extract the video IDs from the playlist items
    const videoIds = piRes?.data?.items?.map(
      (item) => item?.contentDetails?.videoId
    );

    // Send request for video details
    const vdRes = await yt?.videos.list({
      part: ["contentDetails"],
      id: videoIds as string[] | undefined,
      key: YOUTUBE_API_KEY,
    });

    if (!vdRes || vdRes.status !== 200) {
      console.log("error in getting video details!", vdRes?.data);
      return null;
    }

    while (piRes && vdRes) {
      // Do something with the results on this page

      piRes?.data?.items
        ? piRes?.data?.items
            ?.filter((video) => video?.snippet?.title !== "Deleted video")
            .forEach((video, index) => {
              const videoTitle = video?.snippet?.title ?? "";
              const videoThumbnail =
                video?.snippet?.thumbnails?.high?.url ?? "";
              const videoUrl = `https://www.youtube.com/watch?v=${
                video?.snippet?.resourceId?.videoId ?? ""
              }`;
              const ytId = video?.snippet?.resourceId?.videoId ?? "";
              const description = video?.snippet?.description ?? "";
              const duration =
                vdRes?.data?.items &&
                vdRes?.data?.items[index]?.contentDetails?.duration
                  ? Math.ceil(
                      moment
                        .duration(
                          vdRes?.data?.items[index]?.contentDetails?.duration
                        )
                        .asMinutes()
                    )
                  : 0;

              allVideos.push({
                title: videoTitle,
                thumbnail: videoThumbnail,
                videoUrl,
                ytId,
                description,
                duration,
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

        // Extract the video IDs from the new playlist items
        const newVideoIds = piRes?.data?.items?.map(
          (item) => item?.contentDetails?.videoId
        );

        // Send request for the video details on the new page
        const newVdRes = await yt.videos.list({
          part: ["contentDetails"],
          id: newVideoIds as string[],
          key: YOUTUBE_API_KEY,
        });

        vdRes.data.items = [
          ...(vdRes?.data?.items ?? []),
          ...(newVdRes.data.items ?? []),
        ];
      } else {
        // No more pages, end the loop
        break;
      }
    }

    return {
      title: playlistTitle,
      description: playlistDescription,
      thumbnail: playlistThumbnail,
      ytChannelId,
      ytChannelName,
      ytChannelImage,
      videos: allVideos,
    };
  } catch (error) {
    console.log("error in getting playlist data admin", error);
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
