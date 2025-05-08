import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/post/page/1/',
        destination: '/post/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
