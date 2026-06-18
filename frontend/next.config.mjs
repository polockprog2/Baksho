/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion'],
  },
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    
    // Sanitize backendUrl to ensure it starts with http:// or https:// (defaulting to https:// if missing)
    if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://') && !backendUrl.startsWith('/')) {
      backendUrl = `https://${backendUrl}`;
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
