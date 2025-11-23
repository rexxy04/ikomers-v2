import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addToCart } from "@/lib/cart";
import { Product } from "@/lib/products";

export function useProductDetail(product: Product) {
  const router = useRouter();
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Default"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data Derived
  const currentStock = product.stock || 0;
  const isOutOfStock = currentStock === 0; // <--- SUDAH DIPERBAIKI (Tidak ada spasi)

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Logic Handlers
  const handleQtyChange = (type: "inc" | "dec") => {
    if (type === "dec" && qty > 1) setQty(prev => prev - 1);
    if (type === "inc" && qty < currentStock) setQty(prev => prev + 1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Silakan Login terlebih dahulu!");
      router.push("/login");
      return;
    }

    if (isOutOfStock) return;

    setIsSubmitting(true);
    try {
      await addToCart(user.uid, product, selectedColor, qty);
      alert("Berhasil masuk keranjang! 🛒");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan ke keranjang.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    qty,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    currentStock,
    isOutOfStock,
    handleQtyChange,
    handleAddToCart
  };
}