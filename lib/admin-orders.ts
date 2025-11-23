import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";

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

// 1. Ambil Semua Order (Urutkan dari yang terbaru)
export async function getAllOrders(): Promise<AdminOrder[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AdminOrder[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// 2. Update Status Order
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: newStatus
  });
}