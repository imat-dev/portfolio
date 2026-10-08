const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const svgrLoader = { loaders: ['@svgr/webpack'], as: '*.js' }

module.exports = withBundleAnalyzer({
  images: {
    deviceSizes: [428, 540, 640, 768, 1024, 1120],
    // Next 16 only allows quality 75 unless listed; components/Image.jsx uses 90
    qualities: [75, 90],
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
