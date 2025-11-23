interface OrderProps {
  id: string;
  totals: { total: number };
  status: string;
  createdAt: { seconds: number };
}

export default function RecentOrdersTable({ orders }: { orders: OrderProps[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Pesanan Terbaru</h3>
        <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
      </div>
      
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Total</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Tanggal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Belum ada pesanan masuk.</td></tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs font-medium text-gray-500">#{order.id.slice(0, 8)}...</td>
                <td className="px-6 py-4 font-bold text-gray-900">Rp {order.totals?.total?.toLocaleString("id-ID")}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("id-ID") : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}