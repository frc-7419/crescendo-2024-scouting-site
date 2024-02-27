// app/providers.tsx
"use client";

import {NextUIProvider} from '@nextui-org/react'
import {SessionProvider} from 'next-auth/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {LoadStatusContext} from '@/components/LoadStatusContext';
import LoadStatus from '@/components/load-status';
import {useState} from 'react';
import Toast from '@/components/toast';

export function Providers({children}: { children: React.ReactNode }) {
    const [value, setValue] = useState<number>(0);

    return (
        <SessionProvider>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                    <LoadStatusContext.Provider value={{value, setValue}}>
                        <LoadStatus/>
                        <Toast/>
                        {children}
                    </LoadStatusContext.Provider>
                </NextThemesProvider>
            </NextUIProvider>
        </SessionProvider>
    )
}