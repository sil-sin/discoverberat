/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net', 'res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
