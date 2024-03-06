'use client';

import React, {useEffect} from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import enforceAdmin from "@/components/util/enforceadmin";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Leaderboard from "@/components/leaderboard";

const Page = () => {
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        enforceAdmin(session, router);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);
    return (
        <DashboardLayout>
            <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                <Leaderboard/>
            </div>
        </DashboardLayout>
    );
};

export default Page;