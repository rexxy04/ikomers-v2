import BottomNav from "@/components/layout/BottomNav";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-white shadow-2xl overflow-x-hidden relative">
      {children}
      <BottomNav />
    </div>
  );
}