const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const svgrLoader = { loaders: ['@svgr/webpack'], as: '*.js' }

module.exports = withBundleAnalyzer({
  images: {
    deviceSizes: [428, 540, 640, 768, 1024, 1120],
    // Next 16 only serves listed qualities (default [75]). Image.jsx defaults to 90;
    // ImageGallery and BlogCardHorizontal pass 100.
    qualities: [75, 90, 100],
  },
  // Keep old shared links to the resume working after the rename
  async redirects() {
    return [
      {
        source: '/resume.pdf',
        destination: '/Raymart-Marasigan-Resume.pdf',
        permanent: true,
      },
    ]
  },
  turbopack: {
    rules: {
      '*.svg': svgrLoader,
    },
  },
  // Used by `next build --webpack` (the bundle analyzer only supports webpack)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
})
