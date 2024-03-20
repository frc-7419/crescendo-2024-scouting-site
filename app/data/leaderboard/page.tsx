'use client';

import React from 'react';
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Leaderboard from "@/components/data/leaderboard";
import TickerLayout from "@/components/layouts/TickerLayout";

const Page = () => {
    const router = useRouter();
    const {data: session} = useSession({
        required: true
    });

    return (
        <TickerLayout>
            <div id='dash' className="overflow-scroll pt-6 flex flex-col">
                <Leaderboard/>
            </div>
        </TickerLayout>
    );
};

export default Page;