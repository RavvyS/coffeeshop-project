/** @type {import('next').NextConfig} */
/*
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable server components and app directory
    appDir: true,
  },
  
  // Image optimization
  images: {
    domains: [
      'your-supabase-url.supabase.co', // Supabase storage
      'images.unsplash.com', // For demo images
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // PWA configuration (optional)
  // You can add PWA support with next-pwa
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config
    return config;
  },
};

module.exports = nextConfig;
*/