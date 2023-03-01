/** @type {import('next').NextConfig} */
const nextConfig = {
  // avoid weird behavior related to component unmounting (React95 related)
  reactStrictMode: false,
  swcMinify: true,
  images: {
    // XXX: not sure if this needs to be off
    disableStaticImages: true
  },
  transpilePackages: ['@react95/core', '@react95/icons'],
  webpack: (config, options) => {
    config.output.assetModuleFilename = 'static/[hash][ext]';
    config.module.rules.push(
      {
        test: /\.(eot|ttf|woff|woff2|png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext]',
        },
      },
      {
        test: /\.(txt)$/,
        type: 'asset/source'
      }
    )

    // both of these are necessary for integrating v86
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'DEBUG': false,
      })
    )
    config.resolve.fallback = { fs: false };

    return config;
  }
}

module.exports = nextConfig;
