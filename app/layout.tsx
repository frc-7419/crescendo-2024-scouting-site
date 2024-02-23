import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Loading from "@/components/loading";

const alata = Alata({
  subsets: ["latin"],
  weight: "400",
  display: 'swap'
});

export const metadata: Metadata = {
  title: "7419 Scouting App",
  description: "Scouting app for FRC Team 7419",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body className={`${alata.className} transition-colors`}>
        <Providers>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
