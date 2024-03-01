'use client';

import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashCard from "@/components/templates/dash-card";
import BasicData from "@/components/basicdata";

const Page = () => {
    return (
        <DashboardLayout>
            <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                <DashCard title="Basic Data" content={<BasicData/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Page;