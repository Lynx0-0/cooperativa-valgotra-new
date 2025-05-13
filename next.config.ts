/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['prismacloud.duckdns.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prismacloud.duckdns.org',
        port: '51838',
        pathname: '/s/**',
      },
    ],
  },
};

module.exports = nextConfig;