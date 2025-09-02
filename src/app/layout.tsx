import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/ui/site-header";

export const metadata: Metadata = {
  title: "Portal de Peticiones de Oración",
  description: "Portal de Peticiones del Departamento de Oración Fe y Esperanza",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased @container/main`}>
        <SiteHeader />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
