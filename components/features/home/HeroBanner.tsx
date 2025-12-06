"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useState, useEffect } from "react";

interface Props {
  products: Product[];
}

export default function HeroBanner({ products }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide sederhana
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000); // Ganti gambar tiap 5 detik
    return () => clearInterval(interval);
  }, [products]);

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <section className="px-5 py-4">
      <Link href={`/product/${currentProduct.id}`}>
        <div className="relative w-full aspect-[2.2/1] rounded-2xl overflow-hidden bg-gray-100 flex items-center px-6 shadow-sm border border-gray-100">
          
          {/* Background Image (Blurred) agar estetik */}
          <div className="absolute inset-0 opacity-20">
             <Image 
               src={currentProduct.image} 
               alt="bg" 
               fill 
               className="object-cover blur-xl"
             />
          </div>

          {/* Content */}
          <div className="flex-1 z-10 py-4 max-w-[60%]">
            <span className="text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full mb-2 inline-block">
              Highlight
            </span>
            <h2 className="text-lg font-bold leading-snug text-gray-900 line-clamp-2">
              {currentProduct.title}
            </h2>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              {currentProduct.priceString}
            </p>
          </div>

          {/* Product Image Main */}
          <div className="absolute right-2 bottom-0 w-32 h-32">
             <Image 
              src={currentProduct.image} 
              alt={currentProduct.title}
              fill
              className="object-contain drop-shadow-lg"
             />
          </div>
          
        </div>
      </Link>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {products.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-4 bg-yellow-400" : "w-1.5 bg-gray-300"
              }`} 
            />
          ))}
        </div>
      )}
    </section>
  );
}