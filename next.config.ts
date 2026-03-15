/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true,
    dynamic: [
      {
        path: '/login',
        dynamic: 'force-dynamic',
      },
    ],
  },
};

export default nextConfig;
