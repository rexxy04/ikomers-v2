import LoginForm from "@/components/features/auth/LoginForm";
import Link from "next/link";
import Image from "next/image"; // Pastikan Image diimport

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      {/* 1. Header Text */}
      <h1 className="text-lg font-bold text-gray-900 mb-4">LOGIN</h1>

      {/* 2. Illustration (UPDATED) */}
      <div className="flex justify-center mb-8">
        <div className="relative w-64 h-64"> {/* Sesuaikan ukuran container jika perlu */}
          <Image
            src="/login.png" // Aset dari folder public
            alt="Login Illustration"
            fill
            className="object-contain"
            priority // Agar gambar dimuat duluan (karena di atas layar)
          />
        </div>
      </div>

      {/* 3. Title Section */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900">
          <span className="text-yellow-400 font-bold">Selamat Datang</span> <span className="font-bold">Kembali</span>
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          Silahkan Masukkan Email dan Password
        </p>
      </div>

      {/* 4. The Form Logic */}
      <div className="flex-1">
        <LoginForm />
      </div>

      {/* 5. Footer Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-gray-900 font-bold hover:text-yellow-500">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}