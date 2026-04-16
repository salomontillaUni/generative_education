import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://solid-parakeet-695xjwv46w7vc9g9-3000.app.github.dev/', // Your specific codespace URL
        'localhost:3000'
      ],
    },
  },
};

export default nextConfig;
