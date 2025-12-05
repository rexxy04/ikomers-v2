import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy, onSnapshot } from "firebase/firestore";

export interface ReviewData {
  id?: string;
  orderId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

// 1. Submit Review Baru
export async function addReview(data: ReviewData) {
  const reviewsRef = collection(db, "products", data.productId, "reviews");
  await addDoc(reviewsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// 2. Ambil Review (Sekali fetch - Lama)
export async function getProductReviews(productId: string) {
  const reviewsRef = collection(db, "products", productId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 3. REALTIME LISTENER (Baru - Cepat)
export function subscribeToProductReviews(productId: string, callback: (reviews: ReviewData[]) => void) {
  const reviewsRef = collection(db, "products", productId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReviewData[];
    callback(data);
  });
}