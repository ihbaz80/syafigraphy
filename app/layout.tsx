import "../app/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../lib/ThemeContext";
import { CartProvider } from "../lib/CartContext";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Syafigraphy - Arabic Calligraphy Art Gallery",
  description: "Discover beautiful Arabic calligraphy artwork by Syafigraphy. Handcrafted pieces for your home, office, or special occasions. Shop now with secure ToyyibPay payment gateway.",
  keywords: "Arabic calligraphy, Islamic art, calligraphy artwork, Syafigraphy, Malaysian calligrapher, Islamic decoration",
  authors: [{ name: "Syafigraphy" }],
  openGraph: {
    title: "Syafigraphy - Arabic Calligraphy Art Gallery",
    description: "Discover beautiful Arabic calligraphy artwork by Syafigraphy. Handcrafted pieces for your home, office, or special occasions.",
    type: "website",
    locale: "en_MY",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
