"use client";

import { useState } from "react";
import { Star, Camera, Video, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { addReview } from "@/lib/reviews";
import { auth } from "@/lib/firebase";

interface Props {
  product: any; // Data barang yang dinilai
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RatingModal({ product, orderId, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await addReview({
        orderId,
        productId: product.productId, // Pastikan field ini ada di item order
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        rating,
        comment
      });
      alert("Terima kasih atas penilaianmu!");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim ulasan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Produk */}
      <div>
        <h3 className="font-bold text-lg mb-4">Pesanan</h3>
        <div className="flex gap-4">
           <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image src={product.image} alt={product.title} fill className="object-cover" />
           </div>
           <div>
              <h4 className="font-bold text-sm text-gray-900">{product.title}</h4>
              <p className="text-xs text-gray-500 mt-1">Warna: {product.selectedColor}</p>
              <p className="text-sm font-bold mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
           </div>
        </div>
      </div>

      {/* Bintang Rating */}
      <div>
        <h3 className="font-bold text-lg mb-2">Nilai Produk</h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
              <Star 
                size={32} 
                className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-100"} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <h3 className="font-bold text-lg mb-2">Tambahkan Deskripsi</h3>
        <textarea 
          placeholder="Barangnya berfungsi dengan baik..." 
          className="w-full border border-yellow-400 rounded-xl p-3 text-sm focus:outline-yellow-500 min-h-[100px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Dummy Upload (Visual Saja) */}
      <div>
        <h3 className="font-bold text-lg mb-2">Tambahkan Foto dan Video</h3>
        <div className="flex gap-4">
           <div className="border-2 border-dashed border-yellow-400 rounded-xl w-full h-24 flex items-center justify-center text-gray-400">
              <Camera size={24} />
           </div>
           <div className="border-2 border-dashed border-yellow-400 rounded-xl w-full h-24 flex items-center justify-center text-gray-400">
              <Video size={24} />
           </div>
        </div>
      </div>

      <Button fullWidth onClick={handleSubmit} isLoading={loading}>
        Nilai
      </Button>
    </div>
  );
}