"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; 
import Image from "next/image";
import { Send, User, ChevronLeft, Camera, X } from "lucide-react"; 
import { auth } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { getMessagesQuery, sendMessage, uploadChatImage, Message } from "@/lib/chat"; // Import uploadChatImage

export default function AdminChatRoomPage() {
  const router = useRouter();
  const params = useParams(); 
  const chatId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  // State Gambar Admin
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      if (imageFile) {
        imageUrl = await uploadChatImage(imageFile, chatId);
      }

      const textToSend = inputText;
      setInputText(""); 
      clearImage();
      
      // ADMIN: Param isAdmin = TRUE
      await sendMessage(chatId, currentUser.uid, textToSend, true, undefined, imageUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal kirim");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]"> 
      
      {/* Header */}
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
              {/* Product Context */}
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

              <div className={`overflow-hidden rounded-2xl max-w-[75%] text-sm ${
                isMe ? "bg-yellow-400 text-black rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"
              }`}>
                {msg.imageUrl && (
                  <div className="relative w-full aspect-square min-w-[150px] bg-gray-100">
                    <Image src={msg.imageUrl} alt="Sent image" fill className="object-cover" />
                  </div>
                )}
                {msg.text && <div className="px-4 py-2">{msg.text}</div>}
              </div>
              
              <span className="text-[10px] text-gray-400 mt-1">
                {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area Admin */}
      <div className="bg-white p-4 border-t sticky bottom-0 z-20">
        
        {/* Preview Admin */}
        {imagePreview && (
          <div className="pb-2 flex">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              <button 
                onClick={clearImage}
                className="absolute top-0 right-0 bg-black/50 text-white p-0.5 hover:bg-red-500"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-end">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <Camera size={20} />
          </button>

          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Balas pesan..."
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-yellow-400 border border-gray-200"
            disabled={isSending}
          />
          <button 
            onClick={handleSend} 
            disabled={isSending || (!inputText.trim() && !imageFile)}
            className="bg-yellow-400 w-11 h-11 rounded-full flex items-center justify-center hover:bg-yellow-500 text-black disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}