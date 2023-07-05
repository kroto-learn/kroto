!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));
import removeImports from "next-remove-imports";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,



  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "cdn.discordapp.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "kroto.s3.ap-south-1.amazonaws.com",
      },
      {
        hostname: "i.ytimg.com",
      },
      { hostname: "yt3.ggpht.com" },
    ],
  },
};
export default removeImports()(config);
