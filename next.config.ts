import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }, // listing media
      { protocol: "https", hostname: "picsum.photos" }, // seed data placeholders
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
    ],
  },
};

export default nextConfig;
