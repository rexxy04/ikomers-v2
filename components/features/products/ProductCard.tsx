import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
}

export default function ProductCard({ id, title, category, price, image }: ProductProps) {
  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-xs font-bold text-gray-900 line-clamp-1 flex-1">{title}</h3>
            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm whitespace-nowrap">{category}</span>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">{price}</p>
        </div>
      </div>
    </Link>
  );
}