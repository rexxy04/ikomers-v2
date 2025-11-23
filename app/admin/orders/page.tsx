"use client";

import { useEffect, useState } from "react";
import { getAllOrders, AdminOrder } from "@/lib/admin-orders";
import OrdersTable from "@/components/features/admin/orders/OrdersTable";
import OrderDetailModal from "@/components/features/admin/orders/OrderDetailModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pesanan Masuk</h1>
        <p className="text-gray-500 mt-1">Pantau dan kelola status pengiriman barang.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat pesanan...</div>
      ) : (
        <OrdersTable orders={orders} onView={(order) => setSelectedOrder(order)} />
      )}

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdate={() => {
            fetchOrders(); // Refresh tabel setelah update status
          }}
        />
      )}
    </div>
  );
}