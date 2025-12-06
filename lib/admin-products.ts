import { db, storage } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ProductVariant } from "./products";

export interface ProductFormState {
  id?: string; // Optional untuk mode Edit
  sku: string; // Baru
  title: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  
  variantType: "color" | "size" | "custom" | "none";
  variants: ProductVariant[];
  
  imageFile: File | null;
  currentImageUrl?: string; // Untuk mode Edit (jika tidak ganti gambar)
  isFeatured: boolean;
}

async function uploadImage(file: File): Promise<string> {
  const filename = `products/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 1. CREATE
export async function createProduct(data: ProductFormState) {
  if (!data.imageFile) throw new Error("Gambar wajib diupload");

  const imageUrl = await uploadImage(data.imageFile);
  const priceString = `Rp ${data.price.toLocaleString("id-ID")}`;

  await addDoc(collection(db, "products"), {
    sku: data.sku,
    title: data.title,
    category: data.category,
    price: data.price,
    priceString,
    description: data.description,
    stock: data.stock,
    variantType: data.variantType,
    variants: data.variants,
    isFeatured: data.isFeatured,
    image: imageUrl,
    createdAt: serverTimestamp(),
  });
}

// 2. UPDATE (Baru)
export async function updateProduct(data: ProductFormState) {
  if (!data.id) throw new Error("ID Produk tidak ditemukan");

  let imageUrl = data.currentImageUrl;

  // Jika user upload gambar baru, ganti. Jika tidak, pakai yang lama.
  if (data.imageFile) {
    imageUrl = await uploadImage(data.imageFile);
  }

  const priceString = `Rp ${data.price.toLocaleString("id-ID")}`;
  const productRef = doc(db, "products", data.id);

  await updateDoc(productRef, {
    sku: data.sku,
    title: data.title,
    category: data.category,
    price: data.price,
    priceString,
    description: data.description,
    stock: data.stock,
    variantType: data.variantType,
    variants: data.variants,
    isFeatured: data.isFeatured,
    image: imageUrl,
    updatedAt: serverTimestamp(),
  });
}

// 3. DELETE
export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}