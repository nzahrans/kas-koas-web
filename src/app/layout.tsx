import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kas Koas - Sistem Pencatatan Keuangan",
    template: "%s | Kas Koas",
  },
  description: "Sistem Transparansi dan Pencatatan Keuangan Kas Kelompok Koas Dokter Muda",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
