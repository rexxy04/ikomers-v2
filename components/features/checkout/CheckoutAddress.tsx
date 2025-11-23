import { MapPin } from "lucide-react";
import { Address } from "@/lib/address";
import Button from "@/components/ui/Button"; // Import Button

interface Props {
  address: Address | null;
  onSelect: () => void;
}

export default function CheckoutAddress({ address, onSelect }: Props) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-base text-gray-900">Alamat</h2>
        <Button 
          onClick={onSelect}
          size="sm" // Ukuran kecil
          className="h-8 px-4 text-xs" // Custom sedikit biar pas
        >
          {address ? "Ganti" : "Pilih"}
        </Button>
      </div>
      
      {address ? (
        <div className="border border-gray-200 rounded-xl p-3 flex gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
             <MapPin className="text-red-500" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">{address.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{address.fullAddress}</p>
          </div>
        </div>
      ) : (
        <div 
          onClick={onSelect}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <span className="text-sm font-bold">+ Pilih Alamat Pengiriman</span>
        </div>
      )}
    </>
  );
}