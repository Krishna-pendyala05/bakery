import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MiniCart from "@/components/checkout/MiniCart";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Sweet Spot | Premium Artisanal Cakes",
  description: "Order fresh, hand-crafted artisanal cakes online from your local neighborhood bakery. Made with love, delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
            {children}
          </main>
          <MiniCart />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
