'use client';

import React, {lazy, ReactNode} from 'react';
import {useSession} from 'next-auth/react';
import {usePathname} from "next/navigation";

const Loadinganim = lazy(() => import('@/components/loading/loadinganim'));

export default function LoadingSession({children}: { children: ReactNode }) {
    const pathname = usePathname()
    const {status, data: session} = useSession();

    if (status === 'loading' && pathname !== '/login' && pathname !== '/logout') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-900">
                <div className="w-40">
                    <Loadinganim/>
                </div>
                <div className="text-xl">
                    Verifying session
                </div>
            </div>
        );
    }

    return children;
}