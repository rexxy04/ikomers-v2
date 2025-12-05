"use client";

import { useState } from "react";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadPaymentProof } from "@/lib/orders";

interface Props {
  orderId: string;
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentProofModal({ orderId, totalAmount, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Mohon pilih foto bukti transfer!");
    
    setLoading(true);
    try {
      await uploadPaymentProof(orderId, file);
      alert("Bukti pembayaran berhasil dikirim! Mohon tunggu verifikasi admin.");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal mengupload gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Bayar */}
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center">
        <p className="text-xs text-gray-500 mb-1">Total yang harus dibayar:</p>
        <h3 className="text-xl font-bold text-yellow-700">Rp {totalAmount.toLocaleString("id-ID")}</h3>
        <p className="text-[10px] text-gray-400 mt-2">
          Silakan transfer ke <span className="font-bold text-gray-700">BCA 1234567890</span> <br/> a.n Ikomers Store
        </p>
      </div>

      {/* Area Upload */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Upload Bukti Transfer</label>
        
        <div className="relative w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-yellow-400 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center group">
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-contain" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-yellow-500 transition-colors">
              <UploadCloud size={32} className="mx-auto mb-2" />
              <p className="text-xs">Klik untuk pilih gambar</p>
            </div>
          )}
        </div>
        
        {file && (
          <div className="flex justify-between items-center mt-2 p-2 bg-gray-100 rounded-lg">
             <div className="flex items-center gap-2 text-xs text-gray-600 truncate max-w-[80%]">
                <ImageIcon size={14} />
                <span className="truncate">{file.name}</span>
             </div>
             <button onClick={() => { setFile(null); setPreview(null); }} className="text-red-500 p-1">
                <X size={14} />
             </button>
          </div>
        )}
      </div>

      <Button fullWidth onClick={handleSubmit} isLoading={loading} disabled={!file}>
        Kirim Bukti Pembayaran
      </Button>
    </div>
  );
}