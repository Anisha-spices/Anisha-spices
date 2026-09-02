import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '10.230.194.70:3000',
    '10.230.194.70',
    '*.loca.lt',
  ],
};

export default nextConfig;
