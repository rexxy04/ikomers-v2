import { Star } from "lucide-react";

interface ReviewProps {
  name: string;
  rating: number;
  comment: string;
}

export default function ReviewCard({ name, rating, comment }: ReviewProps) {
  return (
    <div className="min-w-[280px] p-4 rounded-xl border border-yellow-400 bg-white mr-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Avatar Bulat (Inisial) */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
            {name.charAt(0)}
          </div>
          <span className="text-sm font-bold text-gray-900">{name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold">{rating}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {comment}
      </p>
    </div>
  );
}