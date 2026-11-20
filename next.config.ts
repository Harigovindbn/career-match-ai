import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "pdfjs-dist",
    "mammoth",
  ],
  experimental: {
    serverActions: {
      // Resumes may be up to 5 MB; leave headroom for multipart overhead.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
