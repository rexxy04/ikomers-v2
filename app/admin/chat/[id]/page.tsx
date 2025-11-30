"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; 
import Image from "next/image";
import { Send, User, ChevronLeft } from "lucide-react"; 
import { auth } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { getMessagesQuery, sendMessage, Message } from "@/lib/chat";

export default function AdminChatRoomPage() {
  const router = useRouter();
  const params = useParams(); 
  const chatId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!chatId) return;
    const q = getMessagesQuery(chatId);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser) return;
    const text = inputText;
    setInputText(""); 
    
    // PENTING: Param ke-4 (isAdmin) = TRUE karena ini halaman Admin
    await sendMessage(chatId, currentUser.uid, text, true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]"> 
      
      {/* Header Chat Admin */}
      <div className="bg-white p-4 border-b flex items-center gap-3">
         <button onClick={() => router.back()} className="md:hidden"><ChevronLeft /></button>
         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} />
         </div>
         <h2 className="font-bold">Chat dengan Pembeli</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.uid;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {/* Product Context (Jika ada) */}
              {msg.productContext && (
                <div className="mb-2 bg-white p-2 rounded border flex gap-3 max-w-[80%]">
                   <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image src={msg.productContext.image} alt="Product" fill className="object-cover" />
                   </div>
                   <div>
                      <p className="text-xs font-bold line-clamp-1">{msg.productContext.title}</p>
                      <p className="text-xs text-yellow-600">{msg.productContext.price}</p>
                   </div>
                </div>
              )}

              <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                isMe ? "bg-yellow-400 text-black rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white p-4 border-t flex gap-3">
        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Balas pesan..."
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-yellow-400 border border-gray-200"
        />
        <button onClick={handleSend} className="bg-yellow-400 w-11 h-11 rounded-full flex items-center justify-center hover:bg-yellow-500 text-black">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}