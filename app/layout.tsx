import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://444s.store"),
  title: { default: "444 Store · Top Up Robux Murah & Kilat", template: "%s · 444 Store" },
  description:
    "Beli Robux via username tanpa password, harga dan stok live, diproses admin 444s. Bayar pakai QRIS, gampang kok.",
  openGraph: {
    title: "444 Store · Top Up Robux Murah & Kilat",
    description: "Robux via username tanpa password. Harga dan stok live, diproses admin 444s.",
    url: "https://444s.store",
    siteName: "444 Store",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/brand/banner.jpg", width: 1400, height: 700, alt: "444 Store" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Pasang tema sebelum halaman tampil supaya tidak berkedip: pilihan pembeli, atau ikut setelan HP/laptop
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a href="#isi" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ground">
          Langsung ke isi
        </a>
        <Header />
        {/* overflow-x-clip: stiker hiasan yang menjorok keluar tidak membuat halaman bisa digeser ke samping */}
        <main id="isi" className="overflow-x-clip">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
