"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="text-green-500 w-12 h-12" strokeWidth={3} />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-[250px]">
        Terima kasih telah berbelanja. Pesananmu sedang diproses oleh penjual.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link 
          href="/" 
          className="bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-md hover:bg-yellow-500 transition-all flex items-center justify-center"
        >
          Lanjut Belanja
        </Link>
        <Link 
          href="/orders"
          className="bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center"
        >
          Lihat Pesanan
        </Link>
      </div>
    </main>
  );
}