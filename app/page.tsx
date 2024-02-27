'use client';

import Image from "next/image";
import LoginForm from "../components/login-form";
import {ThemeProvider} from "next-themes";

export default function Home() {
    return (
        <ThemeProvider>
            <main className="transition-all flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Image src="/your-image.jpg" alt="Your image" width={500} height={500}/>
                    <LoginForm/>
                </div>
            </main>
        </ThemeProvider>
    );
}
