import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy } from "firebase/firestore";

export interface ReviewData {
  orderId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[]; // Optional (URL foto)
}

// 1. Submit Review Baru
export async function addReview(data: ReviewData) {
  // Simpan ke sub-collection 'reviews' di dalam dokumen product
  const reviewsRef = collection(db, "products", data.productId, "reviews");
  await addDoc(reviewsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// 2. Ambil Review per Produk
export async function getProductReviews(productId: string) {
  const reviewsRef = collection(db, "products", productId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}