'use client';

import React, {useEffect, useState} from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashCard from "@/components/templates/dash-card";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import MatchData from "@/components/data/matchdata";

const Page = () => {
    const router = useRouter();
    const {data: session} = useSession({
        required: true
    });
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);
    return (
        <DashboardLayout>
            {windowWidth < 600 ? (
                <div className="bg-amber-700 max-w-full p-6 rounded-lg mb-6">
                    Best viewed in landscape mode.
                </div>
            ) : null}
            <div id='dash' className="overflow-scroll pt-6 flex flex-col">
                <DashCard title="Match" content={<MatchData/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Page;