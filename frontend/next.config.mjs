/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/:path*', // This should match your backend service name in docker-compose
      },
    ]
  },
};

export default nextConfig;
