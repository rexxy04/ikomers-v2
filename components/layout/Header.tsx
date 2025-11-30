"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth"; 

export default function Header() {
  // ... (State user & loading BIARKAN SAMA seperti sebelumnya) ...
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName || "Tamu";
  const avatarUrl = user?.photoURL 
    ? user.photoURL 
    : `https://api.dicebear.com/9.x/avataaars/svg?seed=${displayName}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm flex items-center justify-between px-5 py-4 border-b border-gray-50 transition-all">
      {/* Kiri: User Info */}
      <Link href={user ? "/profile" : "/login"} className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 group-hover:border-yellow-400 transition-colors">
          {!loading && (
            <Image src={avatarUrl} alt="User Avatar" fill className="object-cover" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors">
            {loading ? "..." : `Halo, ${displayName}`}
          </span>
          <span className="text-xs text-gray-500">Ayo mulai belanja</span>
        </div>
      </Link>

      {/* Kanan: Icons */}
      <div className="flex items-center gap-3">
        
        {/* UPDATE DISINI: Ganti Button Search jadi Link */}
        <Link href="/search" className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
          <Search size={20} />
        </Link>
        
        <Link href="/cart" className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative">
          <ShoppingBag size={20} />
        </Link>
      </div>
    </header>
  );
}