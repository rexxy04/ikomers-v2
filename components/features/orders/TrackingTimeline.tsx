import { Check, Truck, Package, Home, Phone } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface Props {
  status: string; // pending, proses, dikirim, selesai
  onClose: () => void;
}

export default function TrackingTimeline({ status, onClose }: Props) {
  
  // --- RENDER UNTUK STATUS: DIKIRIM (Gambar 3) ---
  if (status === "dikirim" || status === "selesai") {
    return (
      <div className="space-y-6">
        {/* Info Kurir */}
        <div className="border border-yellow-400 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
               <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop" alt="Kurir" fill className="object-cover"/>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Mang Opet</h3>
              <p className="text-xs text-gray-500">Kurir SiCepat</p>
            </div>
          </div>
          <button className="p-2 bg-gray-100 rounded-full text-gray-600">
            <Phone size={20} />
          </button>
        </div>

        <h3 className="font-bold text-lg">Status Pengiriman</h3>
        
        {/* Timeline Detail */}
        <div className="relative border-l-2 border-dashed border-gray-200 ml-4 space-y-8 pb-2">
          
          {/* Step 1 */}
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-300 rounded-full" />
            <h4 className="text-sm font-bold text-gray-900">Pesanan sedang dikemas</h4>
            <p className="text-xs text-gray-400">Toko | 17 Agustus | 20.00</p>
          </div>

          {/* Step 2 */}
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-300 rounded-full" />
            <h4 className="text-sm font-bold text-gray-900">Diserahkan ke kurir</h4>
            <p className="text-xs text-gray-400">Pengiriman | 18 Agustus | 10.00</p>
          </div>

          {/* Step 3 (Active) */}
          <div className="relative pl-8">
            <div className="absolute -left-5 top-0 w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-md">
                <Truck size={18} />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mt-1">Pesanan menuju alamat</h4>
            <p className="text-xs text-gray-400">Pengiriman | 19 Agustus | 12.00</p>
          </div>
        </div>

        <Button fullWidth onClick={onClose}>OK</Button>
      </div>
    );
  }

  // --- RENDER UNTUK STATUS: PENDING / PROSES (Gambar 2) ---
  return (
    <div className="space-y-6">
      {/* Info Toko */}
      <div className="border border-yellow-400 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
               Adidas
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Adidas Official</h3>
              <p className="text-xs text-gray-500">Toko</p>
            </div>
          </div>
      </div>

      <h3 className="font-bold text-lg">Status Pengiriman</h3>

      {/* Simple Timeline */}
      <div className="flex items-center gap-4">
         <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
            <Package size={28} />
         </div>
         <div>
            <h4 className="text-sm font-bold text-gray-900">Pesanan Sedang Dikemas</h4>
            <p className="text-xs text-gray-500">Penjual sedang menyiapkan barangmu.</p>
            <p className="text-[10px] text-gray-400 mt-1">17 Agustus | 20.00</p>
         </div>
      </div>

      <Button fullWidth onClick={onClose}>OK</Button>
    </div>
  );
}