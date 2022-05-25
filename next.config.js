/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
}

module.exports = nextConfig
