const nextFonts = require('next-fonts');
const nextImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    disableStaticImages: true
  },
  transpilePackages: ['@react95/core', '@react95/icons'],
  webpack: (config, options) => {
    config.module.rules.push(
      {
        test: /\.(txt|iso)$/i,
        use: 'raw-loader',
      },
    )
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'DEBUG': false,
      })
    )
    config.resolve.fallback = { fs: false };
    return config;
  }
}

module.exports = nextImages(nextFonts(nextConfig));
