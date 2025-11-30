import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc
} from "firebase/firestore";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
  productContext?: { 
    id: string;
    title: string;
    image: string;
    price: string;
  };
}

export interface ChatThread {
  id: string;
  buyerId: string;
  buyerName: string;
  lastMessage: string;
  updatedAt: any;
  isReadByAdmin: boolean; // Fitur tambahan: Status baca
}

// 1. BUAT / AMBIL ROOM CHAT (Dinamis: 1 User = 1 Room Toko)
export async function getOrCreateChatRoom(buyerId: string, buyerName: string) {
  // ID Room sekarang HANYA bergantung pada Buyer ID.
  // Artinya: 1 Buyer hanya punya 1 Thread dengan Toko.
  const chatId = `chat_${buyerId}`; 
  const chatRef = doc(db, "chats", chatId);
  
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    // Jika belum ada, buat room baru
    await setDoc(chatRef, {
      id: chatId,
      buyerId,
      buyerName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: "Memulai percakapan",
      isReadByAdmin: false, 
    });
  }

  return chatId;
}

// 2. KIRIM PESAN
export async function sendMessage(chatId: string, senderId: string, text: string, isAdmin: boolean, productContext?: any) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const chatRef = doc(db, "chats", chatId);

  await addDoc(messagesRef, {
    text,
    senderId,
    createdAt: serverTimestamp(),
    ...(productContext && { productContext })
  });

  // Update thread utama
  await updateDoc(chatRef, {
    lastMessage: text,
    updatedAt: serverTimestamp(),
    // Jika user yg kirim, admin belum baca. Jika admin kirim, admin sudah baca.
    isReadByAdmin: isAdmin ? true : false 
  });
}

// 3. LISTEN PESAN (Untuk User & Admin)
export const getMessagesQuery = (chatId: string) => {
  return query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
};

// 4. LISTEN LIST CHAT (Khusus Admin - Ambil Semua)
export const getAdminChatsQuery = () => {
  return query(collection(db, "chats"), orderBy("updatedAt", "desc"));
};