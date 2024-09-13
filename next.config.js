// next.config.js

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // Add this if you're using Google OAuth profile pictures
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Custom webpack config if needed
    return config;
  },
  env: {
    // Add any public environment variables here
    APP_NAME: 'Abstracta Feedback',
  },
};
