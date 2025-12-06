"use client";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/products";
import { deleteProduct } from "@/lib/admin-products";
import { Plus } from "lucide-react";
import ProductTable from "@/components/features/admin/products/ProductTable";
// Pastikan import ini mengarah ke file ProductForm yang baru
import ProductForm from "@/components/features/admin/products/AddProductForm"; 

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
      fetchProducts();
    }
  };

  // Handler Buka Modal Tambah
  const handleAdd = () => {
    setEditingProduct(null); // Kosongkan data
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit (Dipanggil dari Tabel)
  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Isi data
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
          <p className="text-gray-500 mt-1">Kelola katalog dan stok barang.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-500 shadow-md transition-all"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat produk...</div>
      ) : (
        // Pass fungsi handleEdit ke ProductTable
        <ProductTable 
           products={products} 
           onDelete={handleDelete} 
           onEdit={handleEdit} // <--- Tambahan
        />
      )}

      {isModalOpen && (
        <ProductForm 
          initialData={editingProduct} // Kirim data jika edit
          onCancel={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }} 
        />
      )}
    </div>
  );
}