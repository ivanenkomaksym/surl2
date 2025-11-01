import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Optional: Configure trailing slash behavior
  trailingSlash: true,
  
  // Optional: Configure asset prefix for CDN
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-domain.pages.dev' : '',
};

export default nextConfig;
