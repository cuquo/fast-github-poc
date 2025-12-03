import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  cacheLife: {
    poc: {
      expire: 86400, // 1 day
      revalidate: 86400, // 1 hour
      stale: 86400, // 1 hour
    },
  },
  experimental: {
    inlineCss: true,
    staleTimes: {
      dynamic: 60,
    },
  },
  // logging: {
  //   fetches: {
  //     fullUrl: false,
  //   },
  // },
  reactCompiler: true,
};

export default nextConfig;
