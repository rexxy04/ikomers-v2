"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, MapPin } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getAddresses, Address } from "@/lib/address";
import Link from "next/link";

export default function AddressListPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (auth.currentUser) {
        const data = await getAddresses(auth.currentUser.uid);
        setAddresses(data);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSelect = (addr: Address) => {
    // Simpan alamat terpilih ke LocalStorage agar Checkout bisa membacanya
    localStorage.setItem("selected_address", JSON.stringify(addr));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-white px-5 pt-4 pb-20">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}><ChevronLeft size={28} /></button>
        <h1 className="text-lg font-bold">Pilih Alamat</h1>
      </header>

      {/* Button Add New */}
      <Link href="/address/add" className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-xl py-6 mb-6 cursor-pointer">
        <Plus className="text-yellow-600 mb-2" />
        <span className="text-sm font-bold text-yellow-700">Tambah Alamat Baru</span>
      </Link>

      <h2 className="font-bold mb-4">Alamat Tersimpan</h2>
      
      {loading ? <p>Loading...</p> : (
        <div className="flex flex-col gap-3">
          {addresses.length === 0 && <p className="text-gray-400 text-center">Belum ada alamat tersimpan.</p>}
          
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              onClick={() => handleSelect(addr)}
              className="border border-gray-200 rounded-xl p-4 flex gap-3 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                 <MapPin size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{addr.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">{addr.fullAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}