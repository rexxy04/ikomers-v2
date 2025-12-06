import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
        {/* 2. Pasang Toaster di sini */}
        <Toaster 
           position="top-center" 
           toastOptions={{
             duration: 3000,
             style: {
               background: '#333',
               color: '#fff',
               fontSize: '14px',
               borderRadius: '10px',
             },
             success: {
               style: { background: '#FACC15', color: 'black', fontWeight: 'bold' }, // Kuning Ikomers
               iconTheme: { primary: 'black', secondary: '#FACC15' },
             }
           }}
        />
        {children}
      </body>
    </html>
  );
}