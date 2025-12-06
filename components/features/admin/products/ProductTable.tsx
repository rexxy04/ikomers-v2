import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import { Product } from "@/lib/products";

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void; // <--- Props Baru
}

export default function ProductTable({ products, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Produk</th>
            <th className="px-6 py-3">SKU</th>
            <th className="px-6 py-3">Stok</th>
            <th className="px-6 py-3">Varian</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada produk.</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.priceString}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{p.sku || "-"}</td>
                <td className="px-6 py-4">
                    <span className={`font-bold ${p.stock === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                        {p.stock}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {p.variants?.map((v, i) => (
                      p.variantType === 'color' ? (
                        <div key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.value }} title={v.label} />
                      ) : (
                        <span key={i} className="text-[10px] bg-gray-100 px-1 rounded border border-gray-200">{v.label}</span>
                      )
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(p)} // <--- Panggil fungsi Edit
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}