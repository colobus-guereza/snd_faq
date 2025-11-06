import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 압축 설정
  compress: true,
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['@mdx-js/react'],
  },
  
  // 빌드 최적화
  // swcMinify는 Next.js 16에서 기본적으로 활성화되어 있어 제거
  
  // 프로덕션 소스맵 비활성화 (성능 최적화)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
