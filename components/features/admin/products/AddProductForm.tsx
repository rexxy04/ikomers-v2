"use client";

import { useState } from "react";
import { X, Plus, Trash2, UploadCloud, CheckSquare, Square } from "lucide-react";
import { createProduct, ProductFormState } from "@/lib/admin-products";


interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddProductForm({ onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductFormState>({
    title: "",
    category: "",
    price: 0,
    description: "",
    colors: [],
    stock: 0,
    imageFile: null,
    isFeatured: false,
  });

  // State lokal untuk input warna sementara
  const [tempColor, setTempColor] = useState({ name: "", hex: "#000000" });

  const handleAddColor = () => {
    if (!tempColor.name) return;
    setForm(prev => ({ ...prev, colors: [...prev.colors, tempColor] }));
    setTempColor({ name: "", hex: "#000000" }); // Reset
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageFile) return alert("Pilih gambar dulu!");
    
    setLoading(true);
    try {
      await createProduct(form);
      alert("Produk berhasil ditambahkan!");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal upload produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Tambah Produk Baru</h2>
          <button onClick={onCancel}><X className="text-gray-400 hover:text-red-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Upload Gambar */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
            />
            {form.imageFile ? (
              <p className="text-green-600 font-bold">{form.imageFile.name}</p>
            ) : (
              <>
                <UploadCloud size={40} className="mb-2" />
                <span className="text-sm">Klik untuk upload gambar produk</span>
              </>
            )}
          </div>

          {/* 2. Info Dasar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Produk</label>
              <input required type="text" className="w-full p-3 border rounded-xl" placeholder="Contoh: Baju Keren" 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
              <input required type="text" className="w-full p-3 border rounded-xl" placeholder="Contoh: Baju" 
                value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga (Angka)</label>
              <input required type="number" className="w-full p-3 border rounded-xl" placeholder="250000" 
                value={form.price || ""} onChange={e => setForm({...form, price: Number(e.target.value)})} />
            </div>
            
            {/* field tambah stok*/}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stok Awal</label>
              <input required type="number" className="w-full p-3 border rounded-xl" placeholder="100" 
                value={form.stock || ""} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Deskripsi</label>
            <textarea required className="w-full p-3 border rounded-xl h-24" placeholder="Jelaskan produk..." 
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          {/* 3. Varian Warna */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Varian Warna</label>
            
            {/* List Warna yg sudah ada */}
            <div className="flex flex-wrap gap-2 mb-3">
              {form.colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                  <span className="text-sm font-bold">{c.name}</span>
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))}>
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Warna Baru */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input type="text" placeholder="Nama Warna (Biru)" className="w-full p-2 border rounded-lg text-sm"
                  value={tempColor.name} onChange={e => setTempColor({...tempColor, name: e.target.value})} />
              </div>
              <div>
                <input type="color" className="w-10 h-10 p-1 border rounded-lg cursor-pointer"
                  value={tempColor.hex} onChange={e => setTempColor({...tempColor, hex: e.target.value})} />
              </div>
              <button type="button" onClick={handleAddColor} className="bg-gray-900 text-white p-2 rounded-lg">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* --- TAMBAHAN BARU: TOGGLE FEATURED --- */}
          <div 
            onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
              form.isFeatured ? "bg-yellow-50 border-yellow-400" : "bg-gray-50 border-gray-200"
            }`}
          >
            {form.isFeatured ? (
              <CheckSquare className="text-yellow-600" />
            ) : (
              <Square className="text-gray-400" />
            )}
            <div>
              <p className={`font-bold text-sm ${form.isFeatured ? "text-yellow-800" : "text-gray-500"}`}>
                Jadikan Banner Utama (Hero)
              </p>
              <p className="text-xs text-gray-400">
                Produk ini akan muncul di slider halaman depan.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Batal</button>
            <button disabled={loading} className="px-6 py-3 font-bold bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 disabled:opacity-50">
              {loading ? "Mengupload..." : "Simpan Produk"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}