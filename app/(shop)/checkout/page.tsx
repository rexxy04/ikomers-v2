"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Check } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserCart, CartItem } from "@/lib/cart";
import { createOrder } from "@/lib/orders";
import { Address } from "@/lib/address";

// Import Components
import CheckoutAddress from "@/components/features/checkout/CheckoutAddress";
import SelectionRow from "@/components/features/checkout/SelectionRow";
import CheckoutSummary from "@/components/features/checkout/CheckoutSummary";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button"; // Import Button UI

const SHIPPING_OPTIONS = [
  { id: "sicepat", name: "SiCepat Kilat", eta: "16 Agustus", price: 9000, logo: "SICEPAT", color: "bg-red-600" },
  { id: "jnt", name: "J&T Express", eta: "17 Agustus", price: 12000, logo: "J&T", color: "bg-red-500" },
];
const PAYMENT_OPTIONS = [
  { id: "qris", name: "QRIS", desc: "Scan Barcode", logo: "QRIS", type: "qris" },
  { id: "mandiri", name: "Bank Mandiri", desc: "Transfer Bank", logo: "MANDIRI", type: "bank" },
  { id: "bri", name: "Bank BRI", desc: "Transfer Bank", logo: "BRI", type: "bank" },
  { id: "dana", name: "DANA", desc: "E-Wallet", logo: "DANA", type: "wallet" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState<Address | null>(null);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_OPTIONS[1]);

  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const savedAddr = localStorage.getItem("selected_address");
    if (savedAddr) setAddress(JSON.parse(savedAddr));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const cartItems = await getUserCart(user.uid);
        setItems(cartItems);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 1000;
  const totalPayment = subtotal + selectedShipping.price + serviceFee;

  const handlePayment = async () => {
    if (!userId) return;
    if (!address) return alert("Mohon pilih alamat pengiriman!");
    
    setIsProcessing(true);
    try {
      await createOrder(userId, items, {
        subtotal,
        shipping: selectedShipping.price,
        service: serviceFee,
        total: totalPayment,
        shippingMethod: selectedShipping.name,
        paymentMethod: selectedPayment.name,
        address: address.fullAddress
      });
      localStorage.removeItem("selected_address");
      router.push("/order-success");
    } catch (error) {
      alert("Gagal memproses pesanan.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-white pb-32 relative">
      <header className="sticky top-0 z-10 bg-white flex items-center gap-4 px-5 py-4 shadow-sm">
        <button onClick={() => router.back()}><ChevronLeft size={28} className="text-yellow-500" /></button>
        <h1 className="text-lg font-bold text-black flex-1 text-center mr-8">Checkout</h1>
      </header>

      <div className="px-5 mt-6">
        <CheckoutAddress address={address} onSelect={() => router.push("/address")} />

        <h2 className="font-bold text-base text-gray-900 mt-6 mb-3">Pesanan ({items.length})</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Warna : <span className="text-gray-600 font-medium">{item.selectedColor}</span></p>
              </div>
              <p className="text-sm font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <SelectionRow 
            title="Opsi Pengiriman"
            label={selectedShipping.name}
            subLabel={`Estimasi tiba ${selectedShipping.eta}`}
            icon={<div className={`w-8 h-8 ${selectedShipping.color} rounded text-white text-[8px] font-bold flex items-center justify-center italic`}>{selectedShipping.logo}</div>}
            rightContent={<span className="text-sm font-bold text-gray-400 border-l border-gray-300 pl-3">Rp {selectedShipping.price.toLocaleString("id-ID")}</span>}
            onClick={() => setShowShippingModal(true)}
          />
        </div>

        <SelectionRow 
          title="Metode Pembayaran"
          label={selectedPayment.name}
          subLabel={selectedPayment.desc}
          icon={<div className="w-8 h-8 bg-blue-900 rounded-full text-white text-[8px] font-bold flex items-center justify-center">{selectedPayment.logo}</div>}
          onClick={() => setShowPaymentModal(true)}
        />

        <CheckoutSummary 
          subtotal={subtotal} 
          shipping={selectedShipping.price} 
          service={serviceFee} 
          total={totalPayment} 
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 px-5 py-4 z-10">
        <Button 
          fullWidth
          onClick={handlePayment}
          isLoading={isProcessing}
        >
          Bayar Sekarang
        </Button>
      </div>

      {/* SHIPPING MODAL */}
      <BottomSheet isOpen={showShippingModal} title="Opsi Pengiriman" onClose={() => setShowShippingModal(false)}>
        <div className="flex flex-col gap-3">
          {SHIPPING_OPTIONS.map((opt) => (
            <div key={opt.id} onClick={() => { setSelectedShipping(opt); setShowShippingModal(false); }} className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer ${selectedShipping.id === opt.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${opt.color} rounded text-white text-[10px] font-bold flex items-center justify-center italic`}>{opt.logo}</div>
                  <div><p className="font-bold text-sm text-gray-900">{opt.name}</p><p className="text-xs text-gray-500">Estimasi: {opt.eta}</p></div>
              </div>
              <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">Rp {opt.price.toLocaleString("id-ID")}</span>
                  {selectedShipping.id === opt.id && <div className="w-5 h-5 rounded bg-yellow-400 flex items-center justify-center"><Check size={14} className="text-white" /></div>}
              </div>
            </div>
          ))}
          <Button fullWidth className="mt-6" onClick={() => setShowShippingModal(false)}>Konfirmasi</Button>
        </div>
      </BottomSheet>

      {/* PAYMENT MODAL */}
      <BottomSheet isOpen={showPaymentModal} title="Metode Pembayaran" onClose={() => setShowPaymentModal(false)}>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {PAYMENT_OPTIONS.map((opt) => (
              <div key={opt.id} onClick={() => { setSelectedPayment(opt); setShowPaymentModal(false); }} className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer ${selectedPayment.id === opt.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-900">{opt.logo}</div>
                    <p className="font-bold text-sm text-gray-900">{opt.name}</p>
                </div>
                {selectedPayment.id === opt.id && <div className="w-5 h-5 rounded bg-yellow-400 flex items-center justify-center"><Check size={14} className="text-white" /></div>}
              </div>
            ))}
            <Button fullWidth className="mt-6" onClick={() => setShowPaymentModal(false)}>Konfirmasi</Button>
        </div>
      </BottomSheet>

    </main>
  );
}