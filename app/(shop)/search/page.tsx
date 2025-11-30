"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Search as SearchIcon, Filter, Shirt, Scissors, Footprints, Package } from "lucide-react";
import { Product, searchProducts } from "@/lib/products";
import ProductCard from "@/components/features/products/ProductCard";

// Helper untuk Icon Kategori
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("baju")) return <Shirt size={20} />;
  if (cat.includes("celana")) return <Scissors size={20} className="-rotate-90" />; // Icon celana agak mirip gunting/celana
  if (cat.includes("sepatu")) return <Footprints size={20} />;
  return <Package size={20} />;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil query dari URL (jika ada, misal ?q=Lepis)
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data saat query berubah
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Panggil fungsi search yang kita buat di lib
      const results = await searchProducts(query);
      setProducts(results);
      setLoading(false);
    };

    // Debounce sedikit agar tidak spam request saat ngetik
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // LOGIC GROUPING: Mengelompokkan Array Produk menjadi Object berdasarkan Kategori
  // Contoh output: { "Celana": [Prod1, Prod2], "Sepatu": [Prod3] }
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || "Lainnya";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* 1. HEADER SEARCH */}
      <header className="sticky top-0 z-40 bg-white px-5 py-4 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-800">
          <ChevronLeft size={28} />
        </button>
        
        <div className="flex-1 relative">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 text-sm font-medium"
            autoFocus
          />
          <SearchIcon className="absolute left-3 top-2.5 text-yellow-500" size={18} />
        </div>

        <button className="text-gray-800">
          <Filter size={24} />
        </button>
      </header>

      {/* 2. HASIL PENCARIAN */}
      <div className="px-5 mt-4 space-y-8">
        {loading ? (
           <div className="text-center py-20 text-gray-400">Mencari...</div>
        ) : products.length === 0 ? (
           <div className="text-center py-20 text-gray-400">
             <p>Tidak ada produk "{query}" ditemukan.</p>
           </div>
        ) : (
          // Render setiap Group Kategori
          Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category}>
              {/* Judul Kategori + Icon */}
              <div className="flex items-center gap-2 mb-4 text-gray-900">
                {getCategoryIcon(category)}
                <h2 className="text-lg font-bold capitalize">{category}</h2>
              </div>

              {/* Grid Produk */}
              <div className="grid grid-cols-2 gap-4">
                {items.map((p) => (
                  <ProductCard 
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    category={p.category}
                    price={p.priceString}
                    image={p.image}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

// Wrapper Suspense (Wajib di Next.js App Router jika pakai useSearchParams)
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}