

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // évite les soucis de cache en dev
})

const isDev = process.env.NODE_ENV === "development"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = isDev
  ? nextConfig
  : require("next-pwa")({
      dest: "public",
      register: true,
      skipWaiting: true,
    })(nextConfig)