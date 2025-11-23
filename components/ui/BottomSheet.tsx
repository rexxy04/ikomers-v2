"use client";

import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, title, onClose, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 1. OVERLAY: Gunakan z-[90] agar di atas navbar (z-50) */}
      <div 
        className="fixed inset-0 bg-black/50 z-[90] animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* 2. CONTENT: Gunakan z-[100] agar paling depan */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white z-[100] rounded-t-3xl p-6 animate-slide-up shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </>
  );
}