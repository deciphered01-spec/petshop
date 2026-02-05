import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Baycarl Petshop",
    template: "%s | Baycarl Petshop",
  },
  description: "Your trusted pet shop for all your pet needs. Quality pet products, expert care, fast delivery.",
  keywords: ["pet shop", "pet supplies", "pet food", "pet accessories", "Nigeria"],
  authors: [{ name: "Baycarl Petshop" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Baycarl Petshop",
  },
};

import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="top-right" richColors />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
