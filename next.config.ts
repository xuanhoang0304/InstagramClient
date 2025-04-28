import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    devIndicators: false,
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
