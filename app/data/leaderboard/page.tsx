'use client';

import React, {useEffect} from 'react';
import enforceAdmin from "@/components/util/enforceadmin";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Leaderboard from "@/components/data/leaderboard";
import TickerLayout from "@/components/layouts/TickerLayout";

const Page = () => {
    const router = useRouter();
    const {data: session} = useSession({
        required: true
    });

    useEffect(() => {
        enforceAdmin(session, router);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);
    return (
        <TickerLayout>
            <div id='dash' className="overflow-scroll pt-6 flex flex-col">
                <Leaderboard/>
            </div>
        </TickerLayout>
    );
};

export default Page;