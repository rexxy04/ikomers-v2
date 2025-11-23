import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

// Update Interface: Pastikan createdAt tipenya string (atau undefined)
export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  priceString: string;
  image: string;
  description: string;
  stock: number;
  colors?: { name: string; hex: string }[];
  createdAt?: string; // <--- Kita ubah jadi string
}

// 1. Ambil Semua Produk
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc")); // Urutkan dari yg terbaru
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // KONVERSI TIMESTAMP KE STRING ISO
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 2. Ambil 1 Produk by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        // KONVERSI TIMESTAMP KE STRING ISO (PENTING!)
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}