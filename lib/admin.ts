import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export interface DashboardData {
  stats: {
    revenue: number;
    ordersCount: number;
    productsCount: number;
  };
  recentOrders: any[];
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // 1. Fetch Produk (Untuk hitung jumlah)
    const productsSnap = await getDocs(collection(db, "products"));
    
    // 2. Fetch Orders (Untuk hitung revenue & total order)
    const ordersRef = collection(db, "orders");
    const ordersSnap = await getDocs(ordersRef);
    
    let totalRevenue = 0;
    ordersSnap.forEach((doc) => {
      const data = doc.data();
      if (data.totals?.total) {
        totalRevenue += data.totals.total;
      }
    });

    // 3. Fetch 5 Order Terbaru
    const qRecent = query(ordersRef, orderBy("createdAt", "desc"), limit(5));
    const recentSnap = await getDocs(qRecent);
    const recentOrders = recentSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return {
      stats: {
        revenue: totalRevenue,
        ordersCount: ordersSnap.size,
        productsCount: productsSnap.size,
      },
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
}