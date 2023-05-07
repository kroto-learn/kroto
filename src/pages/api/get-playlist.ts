import { env } from "@/env.mjs";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import type { NextRequest, NextResponse } from "next/server";

export async function getPlaylist(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        headers: {
          Accept: "application/json",
        },
        params: {
          mine: true,
        },
      }
    );
    console.log(response);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(e);
  }
}
