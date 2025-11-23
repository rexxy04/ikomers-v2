import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Izinkan SVG (Wajib untuk Dicebear)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'pngimg.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
    ],
  },
};

export default nextConfig;