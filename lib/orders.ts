import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  doc, 
  getDocs, 
  increment, // Penting untuk stok
  query,     // <-- Perbaikan: Import query
  where,     
  orderBy,
  updateDoc  // <-- Perbaikan: Import orderBy
} from "firebase/firestore";
import { CartItem } from "./cart";

// 1. PERBAIKAN: Definisi Interface AdminOrder (Agar tidak error)
export interface AdminOrder {
  id: string;
  userId: string;
  status: string;
  createdAt: any;
  items: any[];
  totals: {
    total: number;
    address: string;
    shippingMethod: string;
    paymentMethod: string;
  };
}

// Alias agar kompatibel jika ada file lain pakai nama 'Order'
export type Order = AdminOrder;

interface OrderTotals {
  subtotal: number;
  shipping: number;
  service: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  address: string;
}

// 2. PERBAIKAN: Fungsi getUserOrders (Fix error query & orderBy)
export async function getUserOrders(userId: string): Promise<AdminOrder[]> {
  try {
    // Query: Ambil orders milik user, urutkan dari yang terbaru
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    
    // Mapping hasil snapshot ke format AdminOrder[]
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdminOrder[];
    
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

// 3. PERBAIKAN: Fungsi createOrder (Update Stok & Hapus Cart)
export async function createOrder(userId: string, items: CartItem[], totals: OrderTotals) {
  try {
    const batch = writeBatch(db);

    // Buat dokumen order baru di collection 'orders'
    const newOrderRef = doc(collection(db, "orders"));
    batch.set(newOrderRef, {
      userId,
      items,
      totals,
      status: "pending", // Status awal
      createdAt: serverTimestamp(),
    });

    // Potong Stok Produk (Looping semua item yang dibeli)
    items.forEach((item) => {
      const productRef = doc(db, "products", item.productId);
      batch.update(productRef, {
        stock: increment(-item.quantity) // Kurangi stok (negatif)
      });
    });

    // Hapus Keranjang User (Bersih-bersih setelah checkout)
    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    cartSnapshot.forEach((docSnap) => {
      batch.delete(doc(db, "users", userId, "cart", docSnap.id));
    });

    // Eksekusi semua perubahan database sekaligus
    await batch.commit();

    return newOrderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// FUNGSI BARU: Upload Bukti Bayar
export async function uploadPaymentProof(orderId: string, file: File) {
  try {
    // 1. Upload Gambar ke Storage
    // Path: payment_proofs/ORDER_ID.jpg
    const storageRef = ref(storage, `payment_proofs/${orderId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // 2. Update Dokumen Order
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      paymentProof: downloadURL,
      status: "verifikasi", // Status baru: Menunggu Verifikasi Admin
      updatedAt: serverTimestamp() // Update timestamp
    });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading proof:", error);
    throw error;
  }
}