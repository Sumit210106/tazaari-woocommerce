import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/wc-api/:path*',
        destination: 'https://tazaari.com/wp-json/wc/store/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
