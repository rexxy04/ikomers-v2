"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, MapPin, ShoppingBag, User as UserIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import ProfileMenu from "@/components/features/profile/ProfileMenu";
import BottomNav from "@/components/layout/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

  if (!user) return null;

  // Fallback Avatar jika user tidak punya foto
  const avatarUrl = user.photoURL || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.displayName || "User"}`;

  return (
    <main className="min-h-screen bg-white pb-32 px-5 pt-8">
      {/* 1. Header Profil */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-100 mb-4">
          <Image 
            src={avatarUrl} 
            alt="Profile" 
            fill 
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user.displayName || "Pengguna Baru"}</h1>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* 2. Menu List */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Akun Saya</h2>
        
        {/* Link ke Halaman Edit Profile (Nanti dibuat jika sempat) */}
        {/* <ProfileMenu icon={UserIcon} label="Edit Profil" href="/profile/edit" /> */}

        {/* Link ke Riwayat Pesanan (Nanti dibuat) */}
        <ProfileMenu icon={ShoppingBag} label="Pesanan Saya" href="/orders" />

        {/* Link ke Alamat (Sudah Ada) */}
        <ProfileMenu icon={MapPin} label="Alamat Tersimpan" href="/address" />
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Lainnya</h2>
        <ProfileMenu icon={LogOut} label="Keluar Aplikasi" onClick={handleLogout} isDanger />
      </div>

      {/* Bottom Nav sudah ada di layout.tsx atau page utama, 
          tapi karena ini page terpisah, kita bisa import BottomNav di sini juga kalau mau,
          atau biarkan user tekan back */}
       
       {/* TIPS: Agar Bottom Nav muncul terus, sebaiknya BottomNav ditaruh di layout.tsx root. 
           Tapi untuk sekarang, kita pasang manual saja biar cepat */}
       
       <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Kita import BottomNav di sini jika ingin tampil, 
              TAPI karena di app/page.tsx BottomNav dipanggil manual, 
              di sini kita biarkan kosong atau import manual.
              Agar konsisten, saya sarankan import BottomNav di sini. */}
       </div>

    </main>
  );
}