import type { NextConfig } from "next";

const imageServerUrl = new URL(
    process.env.IMAGE_SERVER_URL ||
    process.env.API_URL ||
    'http://localhost:3001',
);

const nextConfig: NextConfig = {
    cacheComponents: true,
    cacheLife: {
        seconds: {
            stale: 0,
            revalidate: 10,
            expire: 10,
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: imageServerUrl.protocol === 'https:' ? 'https' : 'http',
                hostname: imageServerUrl.hostname,
                port: imageServerUrl.port,
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;