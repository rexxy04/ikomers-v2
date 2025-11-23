"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button"; // Import

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        phone: phone,
        email: email,
        role: "user", 
        createdAt: new Date(),
      });

      alert("Pendaftaran Berhasil! Selamat datang.");
      router.push("/");

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar. Silakan login.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password terlalu lemah (min. 6 karakter).");
      } else {
        setError("Gagal mendaftar. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs mb-4 border border-red-100 text-center">
          {error}
        </div>
      )}

      <Input 
        label="Nama" 
        placeholder="Masukkan Nama" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input 
        label="No. Telp" 
        placeholder="Masukkan Nomor Telepon" 
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <Input 
        label="Alamat Email" 
        placeholder="Masukkan Email" 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input 
        label="Password" 
        placeholder="Masukkan Password" 
        isPassword 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Refactored Button */}
      <Button 
        type="submit" 
        fullWidth 
        isLoading={loading} 
        className="mt-6"
      >
        Daftar
      </Button>
    </form>
  );
}