"use client";

import Image from "next/image";
import { Minus, Plus, Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import type { Product } from "@/lib/products";
import { useProductDetail } from "@/hooks/useProductDetail";
import Button from "@/components/ui/Button";

// --- Sub-Komponen ---

const ColorSelector = ({ colors, selected, onSelect }: any) => (
  <div className="mt-6">
    <h3 className="text-base font-bold text-gray-900 mb-3">Warna</h3>
    <div className="flex gap-4">
      {colors.map((c: any) => (
        <button 
          key={c.name} 
          onClick={() => onSelect(c.name)} 
          className="flex flex-col items-center gap-2 group"
        >
          <div 
            className={`w-12 h-12 rounded-full transition-all border border-gray-100 ${selected === c.name ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "group-hover:scale-105"}`}
            style={{ backgroundColor: c.hex }}
          />
          <span className={`text-xs font-medium ${selected === c.name ? "text-gray-900" : "text-gray-400"}`}>{c.name}</span>
        </button>
      ))}
    </div>
  </div>
);

// UPDATE DISINI: Menerima props 'stock' (angka)
const QuantityControl = ({ qty, stock, onChange }: { qty: number, stock: number, onChange: (type: "inc" | "dec") => void }) => {
  const isOutOfStock = stock === 0;

  return (
    <div className="flex flex-col items-end">
      <div className={`flex items-center rounded-full px-1 py-1 gap-1 transition-colors ${isOutOfStock ? 'bg-gray-100' : 'bg-yellow-50 border border-yellow-200'}`}>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onChange("dec")} 
          disabled={isOutOfStock}
          className="rounded-full hover:bg-yellow-200 w-8 h-8"
        >
          <Minus size={14} strokeWidth={3} />
        </Button>
        
        <span className="w-8 text-center text-sm font-bold text-black">{isOutOfStock ? 0 : qty}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onChange("inc")} 
          // Disable jika stok habis ATAU jumlah beli sudah sama dengan sisa stok
          disabled={isOutOfStock || qty >= stock}
          className="rounded-full hover:bg-yellow-200 w-8 h-8"
        >
          <Plus size={14} strokeWidth={3} />
        </Button>

      </div>
      {/* TAMPILKAN ANGKA STOK DISINI */}
      <span className={`text-[10px] mt-1 font-medium ${!isOutOfStock ? 'text-gray-500' : 'text-red-500'}`}>
        {!isOutOfStock ? `Sisa stok: ${stock}` : "Stok Habis"}
      </span>
    </div>
  );
};

// --- Komponen Utama ---

const REVIEWS = [
  { id: 1, name: "Irgi", rating: 5, comment: "Barang bagus!" },
  { id: 2, name: "Fadhil", rating: 4, comment: "Pengiriman oke." },
];

export default function ProductView({ product }: { product: Product }) {
  const { 
    qty, selectedColor, setSelectedColor, isSubmitting, 
    currentStock, isOutOfStock, handleQtyChange, handleAddToCart 
  } = useProductDetail(product);

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen">
      
      {/* 1. Image Area */}
      <div className="relative w-full h-[50vh] flex items-center justify-center p-8 pb-20">
        <div className="relative w-full h-full max-w-[300px]">
           <Image src={product.image} alt={product.title} fill className="object-contain drop-shadow-2xl mix-blend-multiply" />
        </div>
      </div>

      {/* 2. Content Sheet */}
      <div className="relative -mt-10 bg-white rounded-t-[40px] px-6 pt-8 pb-32 min-h-[60vh] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-gray-900">4.9</span>
              <span className="text-sm text-gray-400">(120 review)</span>
            </div>
          </div>
          
          {/* Pass 'currentStock' (angka) ke komponen QuantityControl */}
          <QuantityControl qty={qty} stock={currentStock} onChange={handleQtyChange} />
        </div>

        {product.colors && product.colors.length > 0 && (
          <ColorSelector colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
        )}

        <div className="mt-6 relative">
          <h3 className="text-base font-bold text-gray-900 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{product.description || "Tidak ada deskripsi."}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-base font-bold text-gray-900 mb-3">Review</h3>
          <div className="flex overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
            {REVIEWS.map((r) => <div key={r.id} className="snap-center"><ReviewCard {...r} /></div>)}
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 px-6 py-4 pb-8 z-40 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Harga</span>
          <span className="text-xl font-bold text-gray-900">{product.priceString}</span>
        </div>
        
        <div className="w-[60%]">
          <Button 
            fullWidth
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            isLoading={isSubmitting} 
            variant={isOutOfStock ? "ghost" : "primary"}
            className={isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200" : ""}
          >
            {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
          </Button>
        </div>
      </div>
    </div>
  );
}