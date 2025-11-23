"use client";

import { X, Truck, CheckCircle, XCircle, Package } from "lucide-react";
import { AdminOrder, updateOrderStatus } from "@/lib/admin-orders";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useState } from "react";

interface Props {
  order: AdminOrder;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetailModal({ order, onClose, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (newStatus: string) => {
    if(!confirm(`Ubah status menjadi "${newStatus}"?`)) return;
    
    setLoading(true);
    await updateOrderStatus(order.id, newStatus);
    setLoading(false);
    onUpdate(); // Refresh data di parent
    onClose();  // Tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
            <p className="text-xs text-gray-500 font-mono">ID: {order.id}</p>
          </div>
          <button onClick={onClose}><X className="text-gray-400 hover:text-red-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* 1. Status Action Bar */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 justify-between items-center">
            <span className="text-sm font-bold text-gray-700 uppercase">Update Status:</span>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" onClick={() => handleChangeStatus("proses")} disabled={loading}>
                 <Package size={14} className="mr-1"/> Proses
               </Button>
               <Button size="sm" variant="outline" onClick={() => handleChangeStatus("dikirim")} disabled={loading}>
                 <Truck size={14} className="mr-1"/> Kirim
               </Button>
               <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:border-green-200" onClick={() => handleChangeStatus("selesai")} disabled={loading}>
                 <CheckCircle size={14} className="mr-1"/> Selesai
               </Button>
               <Button size="sm" variant="danger" onClick={() => handleChangeStatus("batal")} disabled={loading}>
                 <XCircle size={14} className="mr-1"/> Batal
               </Button>
            </div>
          </div>

          {/* 2. Info Pengiriman */}
          <div className="grid grid-cols-2 gap-6">
            <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Penerima & Alamat</h3>
               <p className="text-sm font-medium text-gray-900">{order.totals?.address}</p>
            </div>
            <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Metode</h3>
               <p className="text-sm text-gray-600">Kurir: <span className="font-bold">{order.totals?.shippingMethod}</span></p>
               <p className="text-sm text-gray-600">Bayar: <span className="font-bold">{order.totals?.paymentMethod}</span></p>
            </div>
          </div>

          {/* 3. List Barang */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Barang yang dibeli</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl bg-white">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {/* Fallback image jika item.image ada/tidak */}
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.selectedColor} x {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
             <span className="font-bold text-gray-900">Total Pembayaran</span>
             <span className="text-xl font-bold text-yellow-600">Rp {order.totals?.total?.toLocaleString("id-ID")}</span>
          </div>

        </div>
      </div>
    </div>
  );
}