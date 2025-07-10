import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                port: '',
                pathname: '/Yarkis01/TyraDex/images/sprites/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
