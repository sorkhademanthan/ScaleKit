import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Allow localhost for development upload
      {
        protocol: "http",
        hostname: "localhost",
      },
      // Allow any hostname for S3/R2 presigned URLs in development for flexibility
      // For production, restrict to your specific storage domain
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
