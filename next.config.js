const nextFonts = require('next-fonts');
const nextImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    disableStaticImages: true
  },
  transpilePackages: ['@react95/core', '@react95/icons'],
  webpack: (config, options) => {
    config.module.rules.push(
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    )
    return config;
  }
}

module.exports = nextImages(nextFonts(nextConfig));
