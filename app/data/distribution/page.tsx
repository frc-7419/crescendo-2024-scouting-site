'use client';

import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import DashCard from "@/components/templates/dash-card";
import Distribution from "@/components/data/distribution";

const Page = () => {
    const router = useRouter();
    const {data: session} = useSession({
        required: true
    });

    return (
        <DashboardLayout>
            <div id='dash' className="overflow-scroll pt-6 flex flex-col">
                <DashCard title={"Distribution Chart"} content={<Distribution/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Page;