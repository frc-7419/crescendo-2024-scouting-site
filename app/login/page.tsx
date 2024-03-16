'use client';

import React, {useEffect} from "react";

import {useSearchParams} from 'next/navigation';
import {toast} from 'react-hot-toast';
import LoginForm from "@/components/login/login-form";
import ThemeToggle from "@/components/menus/theme-toggle";

export default function Login() {
    const searchParams = useSearchParams()

    const error = searchParams.get("error")

    // Handle error toast on component mount (or when error query param changes)
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]); // Dependency array ensures toast displays only once

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950 relative">
            <LoginForm/>
            <div className="absolute bottom-4 right-4 m-4">
                <ThemeToggle/>
            </div>
        </main>
    );
}