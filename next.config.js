/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.ctfassets.net',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
    ],
  },
  env: {
    EMAILJS_USER_ID: process.env.EMAILJS_USER_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
  },
}

module.exports = nextConfig
