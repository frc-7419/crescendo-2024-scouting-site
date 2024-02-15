'use client';

import Image from "next/image";
import LoginForm from "../components/login-form";
import { ThemeProvider } from "next-themes";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="transition-all flex min-h-screen flex-col items-center justify-between p-24">
        <LoginForm />
      </main>
    </ThemeProvider>
  );
}
