import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { Product } from "./products";

export interface CartItem {
  id: string; // ID dokumen keranjang
  productId: string;
  title: string;
  price: number;
  image: string;
  selectedColor: string;
  quantity: number;
}

// 1. Tambah ke Keranjang
export async function addToCart(userId: string, product: Product, color: string, qty: number) {
  const cartRef = collection(db, "users", userId, "cart");
  
  // Cek apakah produk dengan warna yang sama sudah ada?
  // (Cara sederhana: ID dokumen = productId + warna)
  const customId = `${product.id}-${color}`; 
  const itemRef = doc(cartRef, customId);
  const itemSnap = await getDoc(itemRef);

  if (itemSnap.exists()) {
    // Jika sudah ada, update quantity-nya saja
    const currentQty = itemSnap.data().quantity;
    await updateDoc(itemRef, { quantity: currentQty + qty });
  } else {
    // Jika belum, buat baru
    await setDoc(itemRef, {
      productId: product.id,
      title: product.title,
      price: product.price, // Simpan angka mentah untuk kalkulasi
      image: product.image,
      selectedColor: color,
      quantity: qty
    });
  }
}

// 2. Ambil Keranjang User
export async function getUserCart(userId: string): Promise<CartItem[]> {
  const querySnapshot = await getDocs(collection(db, "users", userId, "cart"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CartItem[];
}

// 3. Update Quantity
export async function updateCartQty(userId: string, cartId: string, newQty: number) {
  const itemRef = doc(db, "users", userId, "cart", cartId);
  if (newQty < 1) return; // Proteksi minimal 1
  await updateDoc(itemRef, { quantity: newQty });
}

// 4. Hapus Item
export async function removeFromCart(userId: string, cartId: string) {
  await deleteDoc(doc(db, "users", userId, "cart", cartId));
}