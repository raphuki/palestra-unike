/** @type {import('next').NextConfig} */
const isOfflineBuild = process.env.UNIKE_OFFLINE === "1";

const nextConfig = {
  ...(isOfflineBuild
    ? {
        output: "export",
        trailingSlash: false,
        assetPrefix: "./",
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
