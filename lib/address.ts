import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";

export interface Address {
  id: string;
  label: string; // Rumah, Kantor
  name: string; // Nama Jalan
  detail: string; // Detail Patokan
  fullAddress: string; // Gabungan untuk display
}

// 1. Tambah Alamat
export async function addAddress(userId: string, data: Omit<Address, "id">) {
  await addDoc(collection(db, "users", userId, "addresses"), {
    ...data,
    createdAt: new Date(),
  });
}

// 2. Ambil List Alamat
export async function getAddresses(userId: string): Promise<Address[]> {
  const q = query(collection(db, "users", userId, "addresses"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Address[];
}