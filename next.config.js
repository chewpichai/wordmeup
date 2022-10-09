/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    mongoUrl: 'mongodb://127.0.0.1:27017/wordmeup',
    secret: '23739f34-c20e-4ecb-b2f4-09e935bd8600',
  },
  output: 'standalone',
}

module.exports = nextConfig
