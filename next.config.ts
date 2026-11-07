import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": [
      "public/naturaleza/**",
      "public/retratos/**",
      "public/deporte/**",
      "public/paisaje/**",
      "public/selection/**",
      "public/*.jpg",
      "public/*.jpeg",
      "public/*.png",
      "public/*.webp",
    ],
  },
};

export default nextConfig;
