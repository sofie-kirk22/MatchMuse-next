import type { NextConfig } from "next";

const repo = "my-project-next";

const nextConfig : NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

