import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Experimental features
  experimental: {
    // Turbopack desteği
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Static exports için
  output: process.env.NODE_ENV === 'production' ? undefined : undefined,
  trailingSlash: false,
  
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'ardahanticaret.com',
      'ardahanticaret.net',
      'yujuwpbtziekevbcmrts.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },

  // Build konfigürasyonu
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Static assets için cache headers
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|gif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS ve JS için cache
      {
        source: '/(.*)\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      // API redirects
      {
        source: '/admin/api/:path*',
        destination: '/api/admin/:path*',
        permanent: true,
      },
    ]
  },

  // Rewrites
  async rewrites() {
    return [
      // API rewrites
      {
        source: '/admin-api/:path*',
        destination: '/api/admin/:path*',
      },
    ]
  },

  // Webpack konfigürasyonu
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Bundle analizi
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    return config
  },

  // TypeScript konfigürasyonu - Geçici olarak ignore
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint konfigürasyonu - Geçici olarak ignore
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  swcMinify: true,
  
  // Compiler seçenekleri
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Dev indicators
  devIndicators: {
    position: 'bottom-left',
  },

  // Standalone output
  ...(process.env.BUILD_STANDALONE === 'true' && {
    output: 'standalone',
  }),
}

export default nextConfig
