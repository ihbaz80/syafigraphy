import "../globals.css";
import { ThemeProvider } from "../../lib/ThemeContext";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AdminAuthProvider } from '@/lib/AdminAuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Admin Dashboard - Syafigraphy",
  description: "Admin dashboard for Syafigraphy calligraphy business",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AdminAuthProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 