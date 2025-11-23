import ProductCard from "@/components/features/products/ProductCard";
import { getProducts } from "@/lib/products";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AllProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Sederhana */}
      <header className="sticky top-0 z-40 bg-white flex items-center gap-4 px-5 py-4 shadow-sm border-b border-gray-50">
        <Link href="/">
          <ChevronLeft size={28} className="text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-black">Semua Produk</h1>
      </header>

      <div className="px-5 mt-6">
        {/* Grid Produk */}
        {products.length === 0 ? (
           <div className="text-center py-20 text-gray-400">
              <p>Belum ada produk tersedia.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
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
        )}
      </div>
    </main>
  );
}