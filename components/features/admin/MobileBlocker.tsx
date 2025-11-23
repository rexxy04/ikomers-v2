import { Monitor } from "lucide-react";

export default function MobileBlocker() {
  return (
    <div className="md:hidden flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Monitor size={40} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Desktop Only</h2>
      <p className="text-gray-500 mt-2 max-w-xs mx-auto">
        Halaman Admin memuat banyak data tabel. Mohon buka di Laptop/PC atau gunakan mode desktop agar lebih optimal.
      </p>
    </div>
  );
}