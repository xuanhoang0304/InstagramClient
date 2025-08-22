import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    devIndicators: false,
    experimental: {
        scrollRestoration: true, // Tự động cuộn lên đầu khi điều hướng
      },
    images: {
        remotePatterns: [
            {
                protocol: "https", // Allow HTTPS protocol (use "http" if needed)
                hostname: "**", // Wildcard to allow all domains (or specify like "example.com")
                port: "", // Leave empty unless specific port is required
                pathname: "**", // Allow all paths
            },
        ],
    },
};

export default nextConfig;
