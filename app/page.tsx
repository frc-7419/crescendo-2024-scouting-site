'use client';

import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950 relative">
            <p>Hello</p>
            <div className="absolute bottom-4 right-4 m-4">
                <ThemeToggle/>
            </div>
        </main>
    );
}
