"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Trash2, Minus, Plus } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserCart, updateCartQty, removeFromCart, CartItem } from "@/lib/cart";
import Button from "@/components/ui/Button"; // Import Button

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const items = await getUserCart(user.uid);
        setCartItems(items);
        setSelectedIds(items.map(item => item.id));
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleQtyChange = async (id: string, currentQty: number, type: "inc" | "dec") => {
    if (!userId) return;
    if (type === "dec" && currentQty === 1) {
        handleDelete(id);
        return;
    }
    const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    await updateCartQty(userId, id, newQty);
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    if(!confirm("Hapus barang ini dari keranjang?")) return;
    setCartItems(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(sid => sid !== id));
    await removeFromCart(userId, id);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const totalPrice = cartItems
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-50 bg-white flex items-center gap-4 px-5 py-4 shadow-sm">
        <button onClick={() => router.back()}>
          <ChevronLeft size={28} className="text-yellow-500" />
        </button>
        <h1 className="text-lg font-bold text-black">Keranjang</h1>
      </header>

      <div className="px-5 mt-4">
        <h2 className="font-bold text-lg mb-4">Pesanan ({cartItems.length})</h2>

        <div className="flex flex-col gap-4">
          {cartItems.length === 0 && (
             <p className="text-center text-gray-400 text-sm py-10">Keranjang kamu kosong.</p>
          )}

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border border-yellow-400 rounded-xl bg-white shadow-sm">
              
              <div className="relative flex items-center">
                 <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="peer w-5 h-5 border-2 border-yellow-400 rounded bg-white checked:bg-yellow-400 appearance-none cursor-pointer"
                 />
                 <div className="absolute text-white opacity-0 peer-checked:opacity-100 top-0.5 left-0.5 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </div>
              </div>

              <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Warna : <span className="font-medium text-black">{item.selectedColor}</span></p>
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-bold text-gray-900">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>

                  {/* Counter Button Refactored */}
                  <div className="flex items-center bg-yellow-400 rounded-lg px-1 py-0.5 gap-1 h-8">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="w-6 h-6 hover:bg-black/10 rounded text-black p-0"
                        onClick={() => item.quantity === 1 ? handleDelete(item.id) : handleQtyChange(item.id, item.quantity, "dec")}
                    >
                       {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                    </Button>
                    
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="w-6 h-6 hover:bg-black/10 rounded text-black p-0"
                        onClick={() => handleQtyChange(item.id, item.quantity, "inc")}
                    >
                       <Plus size={14} strokeWidth={3} />
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-[64px] left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 px-5 py-4 z-50">
        <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-900 text-lg">Rp {totalPrice.toLocaleString("id-ID")}</span>
            <span className="text-sm font-bold text-gray-900">Total diskon : -</span>
        </div>
        
        {/* Checkout Button Refactored */}
        <Button 
          fullWidth
          onClick={() => router.push("/checkout")} 
          disabled={selectedIds.length === 0}
        >
          Checkout
        </Button>
      </div>
    </main>
  );
}