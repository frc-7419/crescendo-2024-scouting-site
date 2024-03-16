'use client';

import React, {useEffect} from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import enforceAdmin from "@/components/util/enforceadmin";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import Picklist from "@/components/data/picklist";

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
                <Picklist/>
            </div>
        </DashboardLayout>
    );
};

export default Page;