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
  createdAt?: string;
}

//Filter interface
export interface FilterOptions {
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: "newest" | "price_low" | "price_high" | "best_seller";
  rating?: number;
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

//search funciton updated with filtering options
export async function searchProducts(options: FilterOptions): Promise<Product[]> {
  // Ambil semua produk (Client-side filtering strategy for MVP)
  let products = await getProducts();
  
  // A. Filter Keyword (Nama & Kategori)
  if (options.keyword) {
    const lowerKeyword = options.keyword.toLowerCase();
    products = products.filter((p) => 
      p.title.toLowerCase().includes(lowerKeyword) || 
      p.category.toLowerCase().includes(lowerKeyword)
    );
  }

  // B. Filter Kategori Spesifik (dari Modal)
  if (options.category) {
    products = products.filter((p) => 
      p.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  // C. Filter Harga Range
  if (options.minPrice !== undefined) {
    products = products.filter((p) => p.price >= (options.minPrice || 0));
  }
  if (options.maxPrice !== undefined && options.maxPrice > 0) {
    products = products.filter((p) => p.price <= (options.maxPrice || 0));
  }

  // D. Sorting
  if (options.sortBy) {
    products.sort((a, b) => {
      switch (options.sortBy) {
        case "price_low": return a.price - b.price;
        case "price_high": return b.price - a.price;
        case "newest": 
           // Asumsi createdAt string ISO, kita bandingkan tanggal
           return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default: return 0;
      }
    });
  }

  // E. Rating (Nanti diimplementasikan jika data rating sudah real)
  // if (options.rating) { ... }

  return products;
}