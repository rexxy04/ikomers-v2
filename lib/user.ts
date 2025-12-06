import { auth, db, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  role: string;
}

// 1. Ambil Data Lengkap User (dari Firestore)
export async function getUserProfile(uid: string): Promise<UserData | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
}

// 2. Update Profil (Foto & Teks)
export async function updateUserProfile(uid: string, name: string, phone: string, file?: File | null) {
  let photoURL = auth.currentUser?.photoURL || "";

  // A. Jika ada file foto baru, upload dulu
  if (file) {
    const storageRef = ref(storage, `users/${uid}/avatar`);
    await uploadBytes(storageRef, file);
    photoURL = await getDownloadURL(storageRef);
  }

  // B. Update Auth (Display Name & Photo) - Agar di Header berubah
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    });
  }

  // C. Update Firestore (Untuk data persisten seperti No HP)
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    name,
    phone,
    photoURL,
    updatedAt: new Date()
  });

  return photoURL;
}