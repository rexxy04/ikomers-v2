"use client";

import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DetailHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 w-full max-w-[480px] mx-auto bg-white/80 backdrop-blur-sm border-b border-gray-50">
      {/* Tombol Back */}
      <button 
        onClick={() => router.back()} 
        className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft size={28} />
      </button>
      
      <h1 className="text-base font-bold text-gray-900">{title}</h1>

      {/* Tombol Cart (FIXED: Sekarang pakai Link) */}
      <Link 
        href="/cart" 
        className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative"
      >
        <ShoppingBag size={24} />
        {/* Jika ingin menambahkan badge notifikasi merah di masa depan, taruh di sini */}
      </Link>
    </header>
  );
}