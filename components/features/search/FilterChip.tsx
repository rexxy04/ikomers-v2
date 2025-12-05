import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

// WAJIB ADA "export default"
export default function FilterChip({ children, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap
        ${isActive 
          ? "bg-yellow-50 border-yellow-400 text-yellow-700" 
          : "bg-white border-gray-200 text-gray-500 hover:border-yellow-200"
        }
      `}
    >
      {children}
    </button>
  );
}