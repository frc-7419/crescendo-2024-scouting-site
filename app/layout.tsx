import React from "react";
import type {Metadata} from "next";
import {Alata} from "next/font/google";
import "./globals.css";
import {Providers} from "./providers";

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
        <head><title>7419 Scouting App</title></head>
        <body className={`${alata.className} transition-colors`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
