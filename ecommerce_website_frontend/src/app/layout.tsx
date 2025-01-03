import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infinite Pickings",
  description: "Choose as much as you want",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-300">
      <body className={inter.className}>
        <div className="max-w-full h-20 bg-white text-black">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
);
}
