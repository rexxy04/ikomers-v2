"use client";

import { Home, ShoppingCart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Keranjang", icon: ShoppingCart, href: "/cart" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Daftar halaman di mana BottomNav TIDAK BOLEH MUNCUL
  const hiddenPaths = ["/login", "/register", "/checkout", "/address", "/address/add", "/order-success"];
  
  // Cek apakah pathname saat ini ada di daftar hiddenPaths
  // Atau jika pathname diawali dengan "/product/" (Halaman detail produk biasanya tidak pakai bottom nav utama)
  const isHidden = hiddenPaths.includes(pathname) || pathname.startsWith("/product/");

  if (isHidden) return null; // Jangan render apa-apa

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 max-w-[480px] mx-auto pb-safe">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              <Icon size={24} fill={isActive ? "currentColor" : "none"} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}