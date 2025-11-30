"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
// TAMBAHAN: Import MessageCircle untuk icon chat
import { LayoutDashboard, Package, ShoppingBag, LogOut, User, MessageCircle } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. CEK OTORISASI (Login & Role Admin)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login"); 
      } else {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true); 
          } else {
            alert("Akses Ditolak! Area ini khusus Admin.");
            router.push("/"); 
          }
        } catch (error) {
          console.error("Error checking role:", error);
          router.push("/");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">Memuat Panel Admin...</div>;
  if (!isAdmin) return null;

  // Helper untuk styling menu aktif
  const getLinkClass = (path: string) => {
    // Logic agar /admin/chat/123 tetap menyalakan menu /admin/chat
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    
    return `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
      isActive 
        ? "bg-yellow-50 text-yellow-600 shadow-sm" 
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* === SIDEBAR (FIXED LEFT) === */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 z-50">
        
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold">I</div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">IKOMERS <span className="text-yellow-500">ADM</span></h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
          
          <Link href="/admin" className={getLinkClass("/admin")}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link href="/admin/products" className={getLinkClass("/admin/products")}>
            <Package size={20} /> Produk
          </Link>
          
          <Link href="/admin/orders" className={getLinkClass("/admin/orders")}>
            <ShoppingBag size={20} /> Pesanan
          </Link>

          {/* MENU BARU: CHAT */}
          <Link href="/admin/chat" className={getLinkClass("/admin/chat")}>
            <MessageCircle size={20} /> Chat Pelanggan
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 px-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                 <User size={16} className="text-gray-500" />
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-900">Admin</p>
                 <p className="text-[10px] text-gray-400">Owner Toko</p>
              </div>
           </div>

           <button 
             onClick={() => router.push("/")} 
             className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors text-sm"
            >
              <LogOut size={18} /> Keluar Panel
           </button>
        </div>
      </aside>

      {/* === MAIN CONTENT (Responsive Margin) === */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header Mobile (Hanya muncul di HP) */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
           <span className="font-bold text-gray-800">Admin Panel</span>
           <button onClick={() => router.push("/")} className="text-xs bg-gray-100 px-3 py-1 rounded-md font-medium">Exit</button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>

      </div>
    </div>
  );
}