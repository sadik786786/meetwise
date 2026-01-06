/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
   images: {
    domains: ['lh3.googleusercontent.com'],
   remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
