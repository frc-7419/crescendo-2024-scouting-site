'use client';

import React, {useEffect, useState} from "react";

import {useSearchParams} from 'next/navigation';
import {toast} from 'react-hot-toast';
import LoginForm from "@/components/login/login-form";
import ThemeToggle from "@/components/menus/theme-toggle";
import TeamLoginForm from "@/components/login/team-login-form";

export default function Login() {
    const searchParams = useSearchParams()

    const error = searchParams.get("error")

    const [asTeam, setAsTeam] = useState(false)
    // Handle error toast on component mount (or when error query param changes)
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]); // Dependency array ensures toast displays only once

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950 relative">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-slate-950">
                {asTeam ? (
                    <>
                        <TeamLoginForm/>
                        <div className='text-right mt-2'>
                            <a onClick={() => setAsTeam(false)} className='text-sm w-full'>Login As Scouter?</a>
                        </div>
                    </>
                ) : (
                    <>
                        <LoginForm/>
                        <div className='text-right mt-2'>
                            <a onClick={() => setAsTeam(true)} className='text-sm w-full'>Login As Team?</a>
                        </div>
                    </>
                )}
            </div>
            <div className="absolute bottom-4 right-4 m-4">
                <ThemeToggle/>
            </div>
        </main>
    );
}