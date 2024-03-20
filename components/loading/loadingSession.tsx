'use client';

import React, {lazy, ReactNode, useEffect} from 'react';
import {useSession} from 'next-auth/react';
import {usePathname, useRouter} from "next/navigation";
import {accessConfig} from "@/config/accessConfig";
import {Access} from "@/types/Access";

const Loadinganim = lazy(() => import('@/components/loading/loadinganim'));

export default function LoadingSession({children}: { children: ReactNode }) {
    const pathname = usePathname()
    const {status, data: session} = useSession();
    const router = useRouter()

    const role: Access = session?.user?.role as Access;
    const allowedAccess = Object.keys(accessConfig)
        .filter(path => pathname.startsWith(path.replace('*', '')))
        .some(path => accessConfig[path].includes(role ?? 'USER'));

    const hasAnyAccess = Object.keys(accessConfig)
        .filter(path => pathname.startsWith(path.replace('*', ''))).length == 0;

    useEffect(() => {
        if (role === 'TEAM' && hasAnyAccess) {
            router.push('/data');
        }

        if (role === 'TEAM' && pathname === '/data/picklist') {
            router.push('/data');
        }

        if (
            (status === 'authenticated' && pathname !== '/login' && pathname !== '/logout') &&
            !(hasAnyAccess || allowedAccess)
        ) {
            router.push('/dashboard');
        }
    }, [router, status, role, pathname]);

    if ((status === 'loading' && pathname !== '/login' && pathname !== '/logout') || !(hasAnyAccess || allowedAccess)) {
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