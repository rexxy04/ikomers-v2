import { DollarSign, ShoppingBag, Package } from "lucide-react";

interface Props {
  revenue: number;
  ordersCount: number;
  productsCount: number;
}

export default function StatsGrid({ revenue, ordersCount, productsCount }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* Revenue */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p>
          <h3 className="text-2xl font-bold text-gray-900">Rp {revenue.toLocaleString("id-ID")}</h3>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Pesanan</p>
          <h3 className="text-2xl font-bold text-gray-900">{ordersCount}</h3>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
          <Package size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Produk</p>
          <h3 className="text-2xl font-bold text-gray-900">{productsCount}</h3>
        </div>
      </div>
    </div>
  );
}