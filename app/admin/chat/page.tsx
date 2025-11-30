"use client";

import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { getAdminChatsQuery, ChatThread } from "@/lib/chat";
import { useRouter } from "next/navigation";
import { User, MessageSquare } from "lucide-react";

export default function AdminChatListPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen daftar chat secara realtime
    const q = getAdminChatsQuery();
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatThread[];
      setThreads(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-medium">
        Memuat daftar pesan...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pesan Masuk</h1>
        <p className="text-gray-500 mt-1">Daftar percakapan dengan pelanggan.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {threads.length === 0 ? (
           <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-4 text-gray-300" />
              <p>Belum ada percakapan masuk.</p>
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {threads.map((thread) => (
              <div 
                key={thread.id} 
                onClick={() => router.push(`/admin/chat/${thread.id}`)} 
                className="p-4 flex items-center gap-4 hover:bg-yellow-50 cursor-pointer transition-colors group"
              >
                {/* Avatar Inisial */}
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-yellow-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500 group-hover:text-yellow-600 transition-all uppercase shrink-0">
                   {thread.buyerName ? thread.buyerName.charAt(0) : <User size={20} />}
                </div>
                
                {/* Info Chat */}
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-base">
                        {thread.buyerName || "Pelanggan Tanpa Nama"}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {thread.updatedAt?.seconds 
                          ? new Date(thread.updatedAt.seconds * 1000).toLocaleDateString("id-ID", {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            }) 
                          : ""}
                      </span>
                   </div>
                   <p className="text-sm text-gray-500 truncate group-hover:text-gray-700">
                     {thread.lastMessage}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}