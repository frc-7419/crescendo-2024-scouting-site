'use client'

import React, { useEffect, useState } from 'react';
import jamesPfp from '@/resources/james.webp';
import ThemeToggle from './theme-toggle';
import { useSession } from 'next-auth/react';


export default function NavBar() {
    const { data: session, status } = useSession()
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            const time = date.toLocaleTimeString();
            setCurrentTime(time);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className={'flex justify-between items-center gap-4 p-6'}>
            <span id='time' className='text-2xl text-left flex-grow'>{currentTime}</span>
            <ThemeToggle />
            <span id='user' className='text-xl text-right'>{session?.user?.name}</span>
            <img src={jamesPfp.src} alt="User Profile" className="w-10 h-10 rounded-full" />
        </nav>
    )
}