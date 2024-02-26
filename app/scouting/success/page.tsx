'use client';

import React, { Suspense, useContext, useEffect, useRef, useState } from 'react';
import BlueAllianceComponent from '@/components/bluealliancecomponent';
import SideBar from '@/components/side-bar';
import NavBar from '@/components/nav-bar';
import DashCard from '@/components/templates/dash-card';
import { LoadStatusContext } from '@/components/LoadStatusContext';
import lottie from 'lottie-web';
import SuccessAnim from '@/resources/Success.json';

const Page = () => {
    const { value, setValue } = useContext(LoadStatusContext) as { value: number; setValue: React.Dispatch<React.SetStateAction<number>> };
    const aRef = useRef<HTMLDivElement>(null);
    const [animationLoaded, setAnimationLoaded] = useState(false);

    useEffect(() => {
        if (!animationLoaded && typeof window !== 'undefined') {
            import('lottie-web').then((lottie) => {
                lottie.default.loadAnimation({
                    container: aRef.current!,
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    animationData: SuccessAnim,
                });
                setAnimationLoaded(true);
            });
        }
    }, [animationLoaded]);

    useEffect(() => {
        setValue(100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                <div className='w-60'>
                    <div ref={aRef}></div>
                    <div className="text-3xl">Success!</div>
                </div>
            </div>
        </main>
    )
};

export default Page;
