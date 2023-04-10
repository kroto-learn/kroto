!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

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
    ],
  },
};
export default config;
