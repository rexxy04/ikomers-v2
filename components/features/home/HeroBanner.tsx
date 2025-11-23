import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="px-5 py-4">
      <div className="relative w-full aspect-[2.2/1] rounded-2xl overflow-hidden bg-gradient-to-r from-[#FFF8D6] to-[#FFFBE6] flex items-center px-6 shadow-sm border border-yellow-50">
        <div className="flex-1 z-10 py-4">
          <h2 className="text-lg font-bold leading-snug text-gray-900 max-w-[70%]">
            Nikmati promo hari ini <br/> <span className="text-yellow-600">belanja sepatu</span>
          </h2>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">di Ecommersna anak2ka</p>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40">
           <Image 
            src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5823.png" 
            alt="Promo Shoe"
            fill
            className="object-contain -rotate-12 drop-shadow-xl"
            priority
           />
        </div>
        
        {/* Dekorasi Bulatan */}
        <div className="absolute top-[-40px] left-[-40px] w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-2xl" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        <div className="w-4 h-1.5 rounded-full bg-yellow-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
      </div>
    </section>
  );
}