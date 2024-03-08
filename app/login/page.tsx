'use client';

import LoginForm from "@/components/login/login-form";
import ThemeToggle from "@/components/menus/theme-toggle";

export default function Login() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950 relative">
            <LoginForm/>
            <div className="absolute bottom-4 right-4 m-4">
                <ThemeToggle/>
            </div>
        </main>
    );
}