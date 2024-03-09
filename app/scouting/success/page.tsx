'use client';

import React, {useContext, useEffect, useRef, useState} from 'react';
import {LoadStatusContext} from '@/components/loading/LoadStatusContext';
import SuccessAnim from '@/resources/Success.json';
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Page = () => {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
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
        <DashboardLayout>
            <div className='w-60'>
                <div ref={aRef}></div>
                <div className="text-3xl">Success!</div>
            </div>
        </DashboardLayout>
    )
};

export default Page;
