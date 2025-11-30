"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getOrCreateChatRoom } from "@/lib/chat";

export default function ChatIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Jika user login, cari room chat-nya dan redirect masuk
        try {
          const chatId = await getOrCreateChatRoom(user.uid, user.displayName || "Pembeli");
          router.replace(`/chat/${chatId}`);
        } catch (error) {
          console.error("Gagal memuat chat:", error);
        }
      } else {
        // Jika belum login, lempar ke login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Tampilkan loading screen sederhana saat sedang proses redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
      <p className="text-gray-500 text-sm font-medium">Menghubungkan ke layanan chat...</p>
    </div>
  );
}