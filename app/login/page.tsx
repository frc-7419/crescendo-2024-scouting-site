'use client';

import Image from "next/image";
import LoginForm from "@/components/login-form";
import NavBar from "@/components/nav-bar";
import ThemeToggle from "@/components/theme-toggle";
import { ThemeProvider } from "next-themes";

export default function Login() {
  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950 relative">
        <LoginForm />
        <div className="absolute bottom-4 right-4 m-4">
          <ThemeToggle />
        </div>
      </main>
    </ThemeProvider>
  );
}