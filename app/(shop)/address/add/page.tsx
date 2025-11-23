"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { addAddress } from "@/lib/address";
import Input from "@/components/ui/Input"; 
import Button from "@/components/ui/Button"; // Import Button

export default function AddAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      await addAddress(auth.currentUser.uid, {
        label,
        name,
        detail,
        fullAddress: `${name}, ${detail}`
      });
      router.back(); 
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan alamat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-5 pt-4">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={28} />
        </button>
        <h1 className="text-lg font-bold">Tambah Alamat</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
           <label className="text-sm font-bold mb-2 block">Tandai Sebagai</label>
           <input 
             placeholder="Contoh: Rumah, Kantor, Kosan"
             className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-yellow-400"
             value={label}
             onChange={(e) => setLabel(e.target.value)}
             required
           />
        </div>

        <div>
           <label className="text-sm font-bold mb-2 block">Nama Jalan / Daerah</label>
           <input 
             placeholder="Masukkan nama jalan"
             className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-yellow-400"
             value={name}
             onChange={(e) => setName(e.target.value)}
             required
           />
        </div>

        <div>
           <label className="text-sm font-bold mb-2 block">Detail Lainnya</label>
           <textarea 
             placeholder="Nomor rumah, pagar warna hitam, dll..."
             className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-yellow-400 min-h-[100px]"
             value={detail}
             onChange={(e) => setDetail(e.target.value)}
             required
           />
        </div>

        <Button 
          type="submit"
          isLoading={loading}
          className="mt-4"
        >
          Simpan Alamat
        </Button>
      </form>
    </main>
  );
}