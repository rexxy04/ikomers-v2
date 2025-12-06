"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Camera } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserProfile } from "@/lib/user";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState(""); // URL Foto preview
  const [file, setFile] = useState<File | null>(null); // File asli

  // Load Data Awal
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Ambil data detail dari Firestore (karena Auth tidak simpan No HP)
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setName(profile.name || "");
          setPhone(profile.phone || "");
          setPreview(profile.photoURL || user.photoURL || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.displayName}`);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // Preview lokal
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSaving(true);
    try {
      await updateUserProfile(auth.currentUser.uid, name, phone, file);
      alert("Profil berhasil diperbarui!");
      router.refresh(); // Refresh agar data di Header terupdate
      router.back();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="sticky top-0 z-40 bg-white flex items-center gap-4 px-5 py-4 shadow-sm border-b border-gray-50">
        <button onClick={() => router.back()}><ChevronLeft size={28} className="text-gray-800" /></button>
        <h1 className="text-lg font-bold text-black">Edit Profil</h1>
      </header>

      <div className="px-5 mt-8 flex flex-col items-center">
        {/* Avatar Upload */}
        <div className="relative mb-8 group cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 relative">
             <Image src={preview} alt="Profile" fill className="object-cover" />
          </div>
          
          {/* Overlay Edit Icon */}
          <label className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full shadow-md cursor-pointer hover:bg-yellow-500 transition-colors">
            <Camera size={20} className="text-black" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <form onSubmit={handleSave} className="w-full space-y-2">
          <Input 
            label="Nama Lengkap" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nama Anda"
          />
          
          <Input 
            label="Nomor Telepon" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="0812..."
            type="tel"
          />

          <div className="pt-6">
            <Button type="submit" fullWidth isLoading={isSaving}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}