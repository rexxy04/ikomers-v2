"use client";

import { useEffect, useState } from "react";
import { getDashboardData, DashboardData } from "@/lib/admin";
import StatsGrid from "@/components/features/admin/StatsGrid";
import RecentOrdersTable from "@/components/features/admin/RecentOrdersTable";

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-500 font-bold">Memuat Data...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan performa toko Anda hari ini.</p>
      </div>

      {/* 1. Kartu Statistik (Revenue, Order, Produk) */}
      <StatsGrid 
        revenue={data.stats.revenue}
        ordersCount={data.stats.ordersCount}
        productsCount={data.stats.productsCount}
      />

      {/* 2. Tabel Pesanan Terbaru */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Transaksi Terbaru</h2>
        <RecentOrdersTable orders={data.recentOrders} />
      </div>
    </div>
  );
}