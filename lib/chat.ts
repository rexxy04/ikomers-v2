import { db, storage } from "@/lib/firebase"; // Import Storage
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  imageUrl?: string; // Field baru untuk gambar
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
  isReadByAdmin: boolean;
}

// 1. BUAT / AMBIL ROOM CHAT
export async function getOrCreateChatRoom(buyerId: string, buyerName: string) {
  const chatId = `chat_${buyerId}`; 
  const chatRef = doc(db, "chats", chatId);
  
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
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

// 2. FUNGSI BARU: UPLOAD GAMBAR CHAT
export async function uploadChatImage(file: File, chatId: string) {
  // Path: chat_images/CHAT_ID/TIMESTAMP_NAMAFILE
  const storageRef = ref(storage, `chat_images/${chatId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 3. KIRIM PESAN (Updated dengan ImageUrl)
export async function sendMessage(
  chatId: string, 
  senderId: string, 
  text: string, 
  isAdmin: boolean, 
  productContext?: any,
  imageUrl?: string // Parameter baru
) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const chatRef = doc(db, "chats", chatId);

  await addDoc(messagesRef, {
    text,
    senderId,
    imageUrl: imageUrl || null, // Simpan URL jika ada
    createdAt: serverTimestamp(),
    ...(productContext && { productContext })
  });

  // Update thread utama
  // Jika kirim gambar tanpa teks, last message jadi "[Gambar]"
  const displayMessage = text || (imageUrl ? "[Gambar]" : "Pesan baru");

  await updateDoc(chatRef, {
    lastMessage: displayMessage,
    updatedAt: serverTimestamp(),
    isReadByAdmin: isAdmin ? true : false 
  });
}

// 4. LISTEN PESAN
export const getMessagesQuery = (chatId: string) => {
  return query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
};

// 5. LISTEN LIST CHAT
export const getAdminChatsQuery = () => {
  return query(collection(db, "chats"), orderBy("updatedAt", "desc"));
};