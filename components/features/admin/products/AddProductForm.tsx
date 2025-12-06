"use client";

import { useState, useEffect } from "react";
import { X, Plus, UploadCloud, CheckSquare, Square, Trash2 } from "lucide-react"; 
import { createProduct, updateProduct, ProductFormState } from "@/lib/admin-products";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface Props {
  initialData?: any; // Data produk untuk mode Edit
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const isEditMode = !!initialData;
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<ProductFormState>({
    id: initialData?.id,
    sku: initialData?.sku || "",
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || "",
    variantType: initialData?.variantType || "color",
    variants: initialData?.variants || [], // Menggantikan colors lama
    imageFile: null,
    currentImageUrl: initialData?.image || "",
    isFeatured: initialData?.isFeatured || false,
  });

  // State temp untuk input varian baru
  const [tempVariant, setTempVariant] = useState({ label: "", value: "" });

  // Init default value untuk color picker jika tipe color
  useEffect(() => {
    if (form.variantType === "color" && !tempVariant.value) {
      setTempVariant({ label: "", value: "#000000" });
    }
  }, [form.variantType]);

  const handleAddVariant = () => {
    if (!tempVariant.label) return;
    
    // Jika tipe size/custom, value disamakan dengan label (misal label XL, value XL)
    // Jika tipe color, value diambil dari color picker
    const valueToAdd = form.variantType === "color" ? tempVariant.value : tempVariant.label;

    setForm(prev => ({ 
      ...prev, 
      variants: [...prev.variants, { label: tempVariant.label, value: valueToAdd }] 
    }));
    
    // Reset temp
    setTempVariant({ label: "", value: form.variantType === "color" ? "#000000" : "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode && !form.imageFile) return alert("Pilih gambar dulu!");
    
    setLoading(true);
    try {
      if (isEditMode) {
        await updateProduct(form);
        alert("Produk berhasil diperbarui!");
      } else {
        await createProduct(form);
        alert("Produk berhasil ditambahkan!");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full"><X className="text-gray-400 hover:text-red-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Upload Gambar */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer relative bg-gray-50">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
            />
            {form.imageFile ? (
              <p className="text-green-600 font-bold">{form.imageFile.name}</p>
            ) : form.currentImageUrl ? (
              <div className="relative w-32 h-32">
                 <Image src={form.currentImageUrl} alt="Current" fill className="object-contain" />
                 <p className="absolute -bottom-6 w-full text-center text-xs text-gray-500">Klik untuk ganti</p>
              </div>
            ) : (
              <>
                <UploadCloud size={40} className="mb-2" />
                <span className="text-sm">Klik untuk upload gambar produk</span>
              </>
            )}
          </div>

          {/* 2. Info Utama (SKU, Nama, Kategori) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">SKU (Kode Barang)</label>
              <input required type="text" className="w-full p-3 border rounded-xl font-mono text-sm" placeholder="CTH: KAO-001" 
                value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Produk</label>
              <input required type="text" className="w-full p-3 border rounded-xl" placeholder="Nama Barang" 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
          </div>

          {/* 3. Harga & Stok */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
              <input required type="text" className="w-full p-3 border rounded-xl" placeholder="Baju" 
                value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            </div>
            <div className="col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga (Rp)</label>
              <input required type="number" className="w-full p-3 border rounded-xl" placeholder="0" 
                value={form.price || ""} onChange={e => setForm({...form, price: Number(e.target.value)})} />
            </div>
            <div className="col-span-1">
               <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stok</label>
               <input required type="number" className="w-full p-3 border rounded-xl" placeholder="0" 
                 value={form.stock || ""} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Deskripsi</label>
            <textarea required className="w-full p-3 border rounded-xl h-24" placeholder="Jelaskan produk..." 
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          {/* 4. Sistem Varian Dinamis */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-3">
               <label className="text-xs font-bold text-gray-500 uppercase block">Atur Varian</label>
               <select 
                 value={form.variantType}
                 onChange={(e) => setForm({...form, variantType: e.target.value as any, variants: []})} // Reset varian jika ganti tipe
                 className="text-xs border p-1 rounded bg-white"
               >
                 <option value="color">Warna</option>
                 <option value="size">Ukuran (Size)</option>
                 <option value="custom">Custom Text</option>
                 <option value="none">Tidak Ada</option>
               </select>
            </div>
            
            {/* List Varian */}
            {form.variantType !== "none" && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      {form.variantType === "color" && (
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: v.value }} />
                      )}
                      <span className="text-sm font-bold">{v.label}</span>
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }))}>
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Varian Baru */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder={form.variantType === "color" ? "Nama Warna (Merah)" : "Label Varian (XL / 128GB)"} 
                      className="w-full p-2 border rounded-lg text-sm"
                      value={tempVariant.label} 
                      onChange={e => setTempVariant({...tempVariant, label: e.target.value})} 
                    />
                  </div>
                  {form.variantType === "color" && (
                    <div>
                      <input type="color" className="w-10 h-10 p-1 border rounded-lg cursor-pointer"
                        value={tempVariant.value} onChange={e => setTempVariant({...tempVariant, value: e.target.value})} />
                    </div>
                  )}
                  <button type="button" onClick={handleAddVariant} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800">
                    <Plus size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 5. Banner Hero Toggle */}
          <div 
            onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
              form.isFeatured ? "bg-yellow-50 border-yellow-400" : "bg-gray-50 border-gray-200"
            }`}
          >
            {form.isFeatured ? <CheckSquare className="text-yellow-600" /> : <Square className="text-gray-400" />}
            <div>
              <p className={`font-bold text-sm ${form.isFeatured ? "text-yellow-800" : "text-gray-500"}`}>
                Jadikan Banner Utama
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
            <Button type="submit" isLoading={loading}>{isEditMode ? "Simpan Perubahan" : "Buat Produk"}</Button>
          </div>

        </form>
      </div>
    </div>
  );
}