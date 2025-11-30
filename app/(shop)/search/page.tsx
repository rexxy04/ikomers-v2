"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Search as SearchIcon, Filter, Shirt, Scissors, Footprints, Package, X } from "lucide-react";
import { Product, searchProducts, FilterOptions } from "@/lib/products"; // Import FilterOptions
import ProductCard from "@/components/features/products/ProductCard";
import SearchFilterModal from "@/components/features/search/SearchFilterModal"; // Import Modal

// Helper Icon (Tetap sama)
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("baju")) return <Shirt size={20} />;
  if (cat.includes("celana")) return <Scissors size={20} className="-rotate-90" />;
  if (cat.includes("sepatu")) return <Footprints size={20} />;
  return <Package size={20} />;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  // STATE UTAMA
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // STATE FILTER
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Partial<FilterOptions>>({});

  // Fetch Data (Trigger saat Query berubah ATAU Filter berubah)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Gabungkan Query Text + Filter Lainnya
      const results = await searchProducts({
        keyword: query,
        ...activeFilters // Spread semua filter aktif (harga, kategori, dll)
      });
      
      setProducts(results);
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, activeFilters]); // Dependency: Query & Filter

  // Grouping Logic (Tetap sama)
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || "Lainnya";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Hitung jumlah filter aktif untuk badge (opsional, UX bagus)
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

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
          {/* Tombol Clear Search */}
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-2.5 text-gray-400">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tombol Filter */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="relative text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Filter size={24} />
          {/* Badge Merah jika ada filter aktif */}
          {activeFilterCount > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </header>

      {/* 2. HASIL PENCARIAN */}
      <div className="px-5 mt-4 space-y-8">
        {loading ? (
           <div className="text-center py-20 text-gray-400">Memuat...</div>
        ) : products.length === 0 ? (
           <div className="text-center py-20 text-gray-400 flex flex-col items-center">
             <SearchIcon size={48} className="mb-4 opacity-20" />
             <p>Tidak ada produk ditemukan.</p>
             <button 
                onClick={() => { setQuery(""); setActiveFilters({}); }} 
                className="mt-4 text-yellow-600 font-bold text-sm hover:underline"
             >
               Reset Pencarian
             </button>
           </div>
        ) : (
          Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4 text-gray-900">
                {getCategoryIcon(category)}
                <h2 className="text-lg font-bold capitalize">{category}</h2>
              </div>
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

      {/* 3. MODAL FILTER */}
      <SearchFilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={activeFilters}
        onApply={(newFilters) => {
          setActiveFilters(newFilters);
          // setIsFilterOpen(false) sudah dipanggil di dalam modal
        }}
      />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}