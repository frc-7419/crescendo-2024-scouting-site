'use client';

import ThemeToggle from "@/components/theme-toggle";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login')
    }, [router])

    return (
        <>
            <p>Hello</p>
            <div className="absolute bottom-4 right-4 m-4">
                <ThemeToggle/>
            </div>
        </>
    );
}
