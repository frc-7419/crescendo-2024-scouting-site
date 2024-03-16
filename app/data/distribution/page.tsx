'use client';

import React, {useEffect} from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import enforceAdmin from "@/components/util/enforceadmin";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import DashCard from "@/components/templates/dash-card";
import Distribution from "@/components/data/distribution";

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
        <DashboardLayout>
            <div id='dash' className="overflow-scroll pt-6 flex flex-col">
                <DashCard title={"Distribution Chart"} content={<Distribution/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Page;