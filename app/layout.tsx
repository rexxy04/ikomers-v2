import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ikomers App",
  description: "Belanja sepatu kekinian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} antialiased`}>
        {/* Render children apa adanya (Full Width) */}
        {/* Batasan lebar 480px nanti ditangani oleh layout di dalam folder (shop) */}
        {children}
      </body>
    </html>
  );
}