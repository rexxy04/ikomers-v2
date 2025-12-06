import RegisterForm from "@/components/features/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image"; // Pastikan Image diimport

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      {/* 1. Header Text */}
      <h1 className="text-lg font-bold text-gray-900 mb-4">DAFTAR</h1>

      {/* 2. Illustration (UPDATED) */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-[280px] h-48"> {/* Container responsive */}
          <Image
            src="/regisil.png" // Aset dari folder public
            alt="Register Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 3. Title Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          Selamat Datang
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Silahkan Daftar Akun Sekarang
        </p>
      </div>

      {/* 4. Form */}
      <div className="flex-1">
        <RegisterForm />
      </div>

      {/* 5. Footer Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-gray-900 font-bold hover:text-yellow-500">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}