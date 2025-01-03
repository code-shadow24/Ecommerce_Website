/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Add this line to allow the Cloudinary domain
  },
};

export default nextConfig;
