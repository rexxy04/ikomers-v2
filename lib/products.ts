import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit } from "firebase/firestore";

// 1. DEFINISI INTERFACE
export interface FilterOptions {
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: "newest" | "price_low" | "price_high" | "best_seller";
  rating?: number;
}

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
  createdAt?: string;
  isFeatured?: boolean; // Field baru untuk Hero Banner
}

// 2. AMBIL SEMUA PRODUK
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 3. AMBIL 1 PRODUK BY ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
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

// 4. CARI PRODUK (FILTER)
export async function searchProducts(options: FilterOptions): Promise<Product[]> {
  let products = await getProducts();
  
  if (options.keyword) {
    const lowerKeyword = options.keyword.toLowerCase();
    products = products.filter((p) => 
      p.title.toLowerCase().includes(lowerKeyword) || 
      p.category.toLowerCase().includes(lowerKeyword)
    );
  }

  if (options.category) {
    products = products.filter((p) => 
      p.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options.minPrice !== undefined) {
    products = products.filter((p) => p.price >= (options.minPrice || 0));
  }
  
  if (options.maxPrice !== undefined && options.maxPrice > 0) {
    products = products.filter((p) => p.price <= (options.maxPrice || 0));
  }

  if (options.sortBy) {
    products.sort((a, b) => {
      switch (options.sortBy) {
        case "price_low": return a.price - b.price;
        case "price_high": return b.price - a.price;
        case "newest": 
           return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default: return 0;
      }
    });
  }

  return products;
}

// 5. AMBIL PRODUK FEATURED (UNTUK HERO BANNER)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    // Ambil produk yang isFeatured = true, urutkan terbaru, ambil max 5
    const q = query(
      productsRef, 
      where("isFeatured", "==", true), 
      orderBy("createdAt", "desc"), 
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Fallback: Jika tidak ada featured product, ambil 3 produk terbaru biasa
    if (querySnapshot.empty) {
       const qFallback = query(productsRef, orderBy("createdAt", "desc"), limit(3));
       const fallbackSnap = await getDocs(qFallback);
       return fallbackSnap.docs.map((doc) => {
         const data = doc.data();
         return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
         };
       }) as Product[];
    }

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching featured:", error);
    return [];
  }
}