/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://*.paypal.com https://*.paypalobjects.com https://apis.google.com https://www.gstatic.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://images.ctfassets.net https://res.cloudinary.com https://lh3.googleusercontent.com https://picsum.photos https://*.paypal.com https://*.paypalobjects.com",
          "font-src 'self' data:",
          "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.paypal.com",
          "frame-src https://*.paypal.com https://*.firebaseapp.com https://accounts.google.com https://www.openstreetmap.org",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    ]
    if (process.env.VERCEL_ENV === 'preview') {
      headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' })
    }
    return [{ source: '/:path*', headers }]
  },
  async redirects() {
    return [
      {
        source: '/tours/wine-tour---pupa-winery',
        destination: '/tours/pupa-winery-wine-tasting',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
