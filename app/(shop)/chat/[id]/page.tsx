"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; 
import Image from "next/image";
import { ChevronLeft, Send, Camera, X } from "lucide-react"; // Tambah Icon Camera & X
import { auth } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { getMessagesQuery, sendMessage, uploadChatImage, Message } from "@/lib/chat"; // Import fungsi baru

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams(); 
  const chatId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  // State untuk Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk input file hidden

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

  // Handle Pilih File
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Buat preview lokal
    }
  };

  // Handle Batal Kirim Gambar
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !imageFile) || !currentUser || isSending) return;
    
    setIsSending(true);
    try {
      let imageUrl = "";
      
      // 1. Jika ada gambar, upload dulu
      if (imageFile) {
        imageUrl = await uploadChatImage(imageFile, chatId);
      }

      // 2. Kirim pesan (Teks + URL Gambar)
      const textToSend = inputText;
      
      // Reset State Dulu (Optimistic UI)
      setInputText("");
      clearImage();

      await sendMessage(chatId, currentUser.uid, textToSend, false, undefined, imageUrl);
      
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Gagal mengirim pesan");
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUser) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="flex flex-col h-screen bg-gray-50 pb-safe">
      <header className="bg-white px-5 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()}><ChevronLeft size={28} /></button>
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">A</div>
           <div>
             <h1 className="font-bold text-gray-900 leading-tight">Admin Toko</h1>
             <span className="text-xs text-green-500 font-medium">Online</span>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              
              {/* Konteks Produk */}
              {msg.productContext && (
                <div className="mb-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex gap-3 max-w-[85%]">
                   <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image src={msg.productContext.image} alt="Product" fill className="object-cover" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{msg.productContext.title}</p>
                      <p className="text-xs text-yellow-600 font-bold">{msg.productContext.price}</p>
                   </div>
                </div>
              )}

              {/* BUBBLE UTAMA */}
              <div className={`overflow-hidden rounded-2xl max-w-[80%] ${
                isMe 
                  ? "bg-yellow-400 text-black rounded-br-none" 
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}>
                
                {/* TAMPILAN GAMBAR DI CHAT */}
                {msg.imageUrl && (
                  <div className="relative w-full aspect-square min-w-[150px] bg-gray-100">
                    <Image src={msg.imageUrl} alt="Sent image" fill className="object-cover" />
                  </div>
                )}

                {/* Teks Pesan */}
                {msg.text && (
                  <div className="px-4 py-2 text-sm">{msg.text}</div>
                )}
              </div>
              
              <span className="text-[10px] text-gray-400 mt-1">
                {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white border-t border-gray-100 sticky bottom-0 z-20">
        
        {/* PREVIEW GAMBAR (Muncul jika ada file dipilih) */}
        {imagePreview && (
          <div className="px-4 pt-4 pb-2 flex">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              <button 
                onClick={clearImage}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="p-4 flex gap-3 items-end">
          {/* Tombol Kamera (Input File Hidden) */}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Camera size={20} />
          </button>

          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={imageFile ? "Tambah caption..." : "Tulis pesan..."}
            className="flex-1 bg-gray-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isSending}
          />
          
          <button 
            onClick={handleSend}
            disabled={isSending || (!inputText.trim() && !imageFile)}
            className="bg-yellow-400 w-11 h-11 rounded-full flex items-center justify-center text-black hover:bg-yellow-500 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </main>
  );
}