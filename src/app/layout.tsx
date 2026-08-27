import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/contexts/Providers";
import Header from "@/components/home/Header";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ToastComponent } from "@/components/ui/ToastComponent";
import { CookieBanner } from "@/components/common/CookieBanner";
import { DemoBanner } from "@/components/common/DemoBanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "JP — Moda Minimalista",
    template: "%s | JP",
  },
  description:
    "Loja de portfólio: roupas minimalistas em tons sóbrios com toques de dourado. Coleções curadas, frete grátis e troca facilitada.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "JP — Moda Minimalista",
    description:
      "Roupas minimalistas em tons sóbrios com toques de dourado. Coleções curadas.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111111",
  viewportFit: "auto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <Providers>
          <DemoBanner />
          <AnnouncementBar />
          <Header />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastComponent />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}