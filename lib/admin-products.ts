import { db, storage } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface ProductFormState {
  title: string;
  category: string;
  price: number;
  description: string;
  colors: { name: string; hex: string }[];
  stock: number;
  imageFile: File | null;
  isFeatured: boolean; // Field untuk status Banner Hero
}

// 1. Upload Gambar ke Firebase Storage
async function uploadImage(file: File): Promise<string> {
  const filename = `products/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 2. Tambah Produk Baru
export async function createProduct(data: ProductFormState) {
  if (!data.imageFile) throw new Error("Gambar wajib diupload");

  // Upload dulu gambarnya
  const imageUrl = await uploadImage(data.imageFile);

  // Format harga ke string display (Rp ...)
  const priceString = `Rp ${data.price.toLocaleString("id-ID")}`;

  // Simpan ke Firestore
  await addDoc(collection(db, "products"), {
    title: data.title,
    category: data.category,
    price: data.price,
    priceString,
    description: data.description,
    stock: data.stock,
    colors: data.colors,
    isFeatured: data.isFeatured, // <--- PENTING: Simpan status featured ke database
    image: imageUrl,
    createdAt: serverTimestamp(),
  });
}

// 3. Hapus Produk
export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
  // Note: Idealnya hapus juga gambar di Storage agar bersih
}