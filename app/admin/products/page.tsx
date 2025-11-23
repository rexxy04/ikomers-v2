"use client";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/products";
import { deleteProduct } from "@/lib/admin-products";
import { Plus } from "lucide-react";
import ProductTable from "@/components/features/admin/products/ProductTable";
import AddProductForm from "@/components/features/admin/products/AddProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fungsi Refresh Data
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
      fetchProducts(); // Refresh setelah hapus
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
          <p className="text-gray-500 mt-1">Kelola katalog barang toko Anda.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-500 shadow-md transition-all"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat produk...</div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}

      {/* Modal Form (Muncul jika showModal true) */}
      {showModal && (
        <AddProductForm 
          onCancel={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchProducts(); // Refresh data setelah sukses tambah
          }} 
        />
      )}
    </div>
  );
}