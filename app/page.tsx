'use client';

import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Loadinganim from "@/components/loading/loadinganim";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login')
    }, [router])

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-900">
                <div className="w-40">
                    <Loadinganim/>
                </div>
                <div className="text-xl">
                    Loading
                </div>
            </div>
        </>
    );
}
