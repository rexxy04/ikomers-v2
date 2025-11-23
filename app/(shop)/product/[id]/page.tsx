import DetailHeader from "@/components/layout/DetailHeader";
import ProductView from "@/components/features/product/ProductView";
import { getProductById } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // FETCH DATA ASLI DARI FIREBASE BERDASARKAN ID
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produk tidak ditemukan :(</p>
      </div>
    );
  }

  // PASS DATA KE PRODUCT VIEW
  return (
    <main className="bg-white min-h-screen">
      <DetailHeader title="Detail Produk" />
      <ProductView product={product} />
    </main>
  );
}