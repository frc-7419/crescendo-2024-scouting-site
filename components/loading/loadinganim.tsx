import React, {useEffect, useRef} from 'react';
import loadinganim from '@/resources/7419load.json';

export default function Loadinganim() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lottie = require('lottie-web');
        const instance = lottie.loadAnimation({
            container: ref.current!,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loadinganim,
        });

        return () => instance.destroy();
    }, []);

    return <div ref={ref}/>;
}