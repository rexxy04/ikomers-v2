interface SummaryProps {
  subtotal: number;
  shipping: number;
  service: number;
  total: number;
}

export default function CheckoutSummary({ subtotal, shipping, service, total }: SummaryProps) {
  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="mt-6">
      <h2 className="font-bold text-base text-gray-900 mb-3">Rincian Pembayaran</h2>
      <div className="space-y-2 text-sm text-gray-500">
         <div className="flex justify-between"><span>Subtotal Pesanan</span><span>Rp {fmt(subtotal)}</span></div>
         <div className="flex justify-between"><span>Subtotal Pengiriman</span><span>Rp {fmt(shipping)}</span></div>
         <div className="flex justify-between"><span>Biaya Layanan</span><span>Rp {fmt(service)}</span></div>
         <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200 mt-2">
            <span>Total Pembayaran</span>
            <span>Rp {fmt(total)}</span>
         </div>
      </div>
    </div>
  );
}