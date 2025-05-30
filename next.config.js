/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除或注释掉 output: 'export' 行
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
