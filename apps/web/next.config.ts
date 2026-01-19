import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler
  reactCompiler: true,
  // Cache Components (antes PPR/Partial Prerendering)
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.hogar.pe',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        // MinIO local
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
      },
      {
        // Backblaze B2
        protocol: 'https',
        hostname: '**.backblazeb2.com',
      },
      {
        // AWS S3
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  // Transpile packages del monorepo
  transpilePackages: ['@hogar/database'],
}

export default nextConfig
