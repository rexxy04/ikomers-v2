import { Eye } from "lucide-react";
import { AdminOrder } from "@/lib/admin-orders";
import Button from "@/components/ui/Button";

interface Props {
  orders: AdminOrder[];
  onView: (order: AdminOrder) => void;
}

export default function OrdersTable({ orders, onView }: Props) {
  
  // Helper warna status
  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "proses": return "bg-blue-100 text-blue-800";
      case "dikirim": return "bg-purple-100 text-purple-800";
      case "selesai": return "bg-green-100 text-green-800";
      case "batal": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Tanggal</th>
            <th className="px-6 py-3">Total</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada pesanan masuk.</td></tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  {order.createdAt?.seconds 
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("id-ID") 
                    : "-"}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  Rp {order.totals?.total?.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="ghost" onClick={() => onView(order)}>
                    <Eye size={16} className="mr-2" /> Lihat
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}