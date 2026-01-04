import type { NextConfig } from 'next';
import withRspack from 'next-rspack';

const withRS = (nextConfig: NextConfig) => {
  if (process.env.RSPACK === '1') {
    return withRspack(nextConfig);
  }
  return nextConfig;
};

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  cacheLife: {
    poc: {
      expire: 86400, // 1 day
      revalidate: 86400, // 1 day
      stale: 86400, // 1 day
    },
  },
  experimental: {
    inlineCss: true,
    // staleTimes: {
    //   dynamic: 60,
    // },
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withRS(nextConfig);
