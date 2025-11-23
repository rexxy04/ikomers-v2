import LoginForm from "@/components/features/auth/LoginForm";
import Link from "next/link";
// import Image from "next/image"; // Uncomment nanti jika gambar sudah ada

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      {/* 1. Header Text */}
      <h1 className="text-lg font-bold text-gray-900 mb-4">LOGIN</h1>

      {/* 2. Illustration Placeholder */}
      <div className="flex justify-center mb-8">
        {/* Placeholder Box: Ganti div ini dengan <Image> nanti */}
        <div className="w-48 h-48 bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
          <span className="text-4xl mb-2">🖼️</span>
          <span className="text-[10px] text-center px-4">
             Area Ilustrasi <br/>
             (Upload ke /public/images/)
          </span>
        </div>

        {/* --- KODE UNTUK NANTI (Jika gambar sudah ada) ---
          Pastikan file ada di folder: ikomers-v2/public/images/login-illust.png
          
          <div className="relative w-48 h-48">
            <Image
              src="/images/login-illust.png" 
              alt="Login Illustration"
              fill
              className="object-contain"
            />
          </div>
        */}
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