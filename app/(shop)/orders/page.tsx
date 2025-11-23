"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserOrders, AdminOrder } from "@/lib/orders"; 
import Button from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";
import TrackingTimeline from "@/components/features/orders/TrackingTimeline";
import RatingModal from "@/components/features/orders/RatingModal";

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [modalType, setModalType] = useState<"tracking" | "rating" | null>(null);

  // Item produk spesifik yang mau dinilai (untuk modal rating)
  const [ratingItem, setRatingItem] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserOrders(user.uid);
        setOrders(data);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // FILTER DATA BERDASARKAN TAB
  // Active: pending, proses, dikirim
  // History: selesai, batal
  const filteredOrders = orders.filter(order => {
    if (activeTab === "active") {
      return ["pending", "proses", "dikirim"].includes(order.status);
    } else {
      return ["selesai", "batal"].includes(order.status);
    }
  });

  // Helper Badge Status (Kode lama)
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending": return <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Belum Dibayar</span>;
      case "proses": return <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">Dikemas</span>;
      case "dikirim": return <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Dikirim</span>;
      case "selesai": return <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Selesai</span>;
      default: return null;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 bg-white flex items-center gap-4 px-5 py-4 shadow-sm border-b border-gray-50">
        <button onClick={() => router.back()}><ChevronLeft size={28} className="text-gray-800" /></button>
        <h1 className="text-lg font-bold text-black">Pesanan Saya</h1>
      </header>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-gray-200 px-5 mt-2">
        <button 
          onClick={() => setActiveTab("active")}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "active" ? "text-gray-900 border-yellow-400" : "text-gray-400 border-transparent"}`}
        >
          Pesanan Saya
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "history" ? "text-gray-900 border-yellow-400" : "text-gray-400 border-transparent"}`}
        >
          Riwayat
        </button>
      </div>

      <div className="px-5 mt-6 flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
           <div className="text-center py-20 text-gray-400">
              <p>{activeTab === "active" ? "Tidak ada pesanan aktif." : "Belum ada riwayat pesanan."}</p>
           </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
              
              {/* List Barang dalam 1 Order */}
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 mb-4 border-b border-dashed border-gray-100 pb-4 last:border-0 last:pb-0 last:mb-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                       {idx === 0 && getStatusBadge(order.status)} {/* Badge cuma di item pertama biar ga rame */}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Warna: {item.selectedColor}</p>
                    <p className="text-xs text-gray-500">Jumlah: {item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 mb-4 mt-2">
                 <span className="text-xs text-gray-500">Total Pembayaran</span>
                 <span className="text-sm font-bold text-gray-900">Rp {order.totals?.total?.toLocaleString("id-ID")}</span>
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex gap-3">
                {/* 1. Tab Active (Pending/Proses/Dikirim) */}
                {activeTab === "active" && (
                  <>
                    {order.status === "pending" ? (
                        <Button size="sm" fullWidth className="text-xs h-10" onClick={() => alert("Transfer manual...")}>Bayar Sekarang</Button>
                    ) : (
                        <Button size="sm" fullWidth className="text-xs h-10" onClick={() => { setSelectedOrder(order); setModalType("tracking"); }}>Lacak Pesanan</Button>
                    )}
                  </>
                )}

                {/* 2. Tab History (Selesai/Batal) */}
                {activeTab === "history" && order.status === "selesai" && (
                  <>
                    <Button variant="outline" size="sm" fullWidth className="text-xs h-10 text-gray-600 border-gray-300">Ajukan Pengembalian</Button>
                    
                    {/* Tombol Nilai (Hanya muncul jika belum dinilai - Idealnya cek DB, tapi skrg kita munculkan dulu) */}
                    <Button 
                      size="sm" fullWidth className="text-xs h-10"
                      onClick={() => { 
                        // Ambil item pertama dulu utk demo rating
                        setRatingItem(order.items[0]); 
                        setSelectedOrder(order);
                        setModalType("rating");
                      }}
                    >
                      Nilai
                    </Button>
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL TRACKING */}
      <BottomSheet 
        isOpen={modalType === "tracking"} 
        title="Status Pesanan" 
        onClose={() => setModalType(null)}
      >
        {selectedOrder && <TrackingTimeline status={selectedOrder.status} onClose={() => setModalType(null)} />}
      </BottomSheet>

      {/* MODAL RATING */}
      <BottomSheet 
        isOpen={modalType === "rating"} 
        title="Beri Penilaian" 
        onClose={() => setModalType(null)}
      >
        {ratingItem && selectedOrder && (
          <RatingModal 
            product={ratingItem} 
            orderId={selectedOrder.id} 
            onClose={() => setModalType(null)}
            onSuccess={() => setModalType(null)}
          />
        )}
      </BottomSheet>

    </main>
  );
}