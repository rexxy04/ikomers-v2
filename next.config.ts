import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Izinkan SVG (untuk Dicebear)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Gambar dummy Unsplash
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',   // Avatar dummy Dicebear
      },
      {
        protocol: 'https',
        hostname: 'pngimg.com',         // Gambar sepatu hero
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Gambar produk dari Firebase Storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // <--- TAMBAHAN: Foto Profil Google
      }
    ],
  },
};

export default nextConfig;