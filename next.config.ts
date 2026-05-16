import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env["SUPABASE_URL"]?.replace(/^https?:\/\//, '') || '',
        pathname: `${process.env["PATH_NAME"]}**`,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
