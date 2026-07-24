import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "./components/layout/Navbar";
import { TabBar } from "./components/layout/TabBar";
import { Toaster } from "sonner";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Adawa Shop",
  description: "Cosmétiques, soins et bien-être",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ORachie",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4A3350",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <TabBar />
          <InstallPrompt />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}