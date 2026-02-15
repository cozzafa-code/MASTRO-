/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabilita ESLint durante il build di produzione
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errori TypeScript durante il build (temporaneo)
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig