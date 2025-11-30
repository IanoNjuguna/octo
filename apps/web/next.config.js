/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  compress: true,
  // Optimize fonts
  optimizeFonts: true,
  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    }
    return config
  },
};

module.exports = nextConfig;
