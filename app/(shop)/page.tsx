import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import HeroBanner from "@/components/features/home/HeroBanner";
import ProductCard from "@/components/features/products/ProductCard";
import { getProducts, getFeaturedProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen pb-24 bg-white">
      <Header />
      <HeroBanner products={featuredProducts}/>

      {/* SECTION 1: PRODUK TERBARU */}
      <section className="px-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Produk Terbaru</h2>
          <button className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">Lihat lainnya</button>
        </div>
        
        {products.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
              <p className="text-sm">Belum ada produk.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                title={p.title} 
                category={p.category} 
                price={p.priceString} // <-- Ambil yang String
                image={p.image} 
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: PRODUK TERLARIS */}
      {products.length > 0 && (
        <section className="px-5 mt-8">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Produk Terlaris</h2>
            <button className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">Lihat lainnya</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* JANGAN PAKAI SPREAD {...p}, MANUAL AJA BIAR AMAN */}
            {[...products].reverse().map((p) => (
              <ProductCard 
                key={`best-${p.id}`} 
                id={p.id}
                title={p.title} 
                category={p.category} 
                price={p.priceString} // <-- Ambil yang String
                image={p.image} 
              />
            ))}
          </div>
        </section>
      )}

    </main>
  );
}