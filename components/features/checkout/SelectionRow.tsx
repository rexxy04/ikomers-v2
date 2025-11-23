import { ChevronRight } from "lucide-react";

interface SelectionRowProps {
  title: string;
  label: string;
  subLabel: string;
  icon: React.ReactNode; // Bisa logo gambar atau teks
  rightContent?: React.ReactNode; // Untuk harga di kanan
  onClick: () => void;
}

export default function SelectionRow({ title, label, subLabel, icon, rightContent, onClick }: SelectionRowProps) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-base text-gray-900 mb-3">{title}</h2>
      <div 
        onClick={onClick}
        className="border border-yellow-400 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-yellow-50 transition-colors"
      >
        <div className="flex items-center gap-3">
           {icon}
           <div>
              <h3 className="text-sm font-bold text-gray-900">{label}</h3>
              <p className="text-xs text-gray-400">{subLabel}</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           {rightContent}
           <ChevronRight size={20} className="text-yellow-400" />
        </div>
      </div>
    </div>
  );
}