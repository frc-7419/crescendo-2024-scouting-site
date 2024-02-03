import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const alata = Alata({
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body className={alata.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
