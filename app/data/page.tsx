'use client';

import React from 'react';
import Charts from '@/components/charts';
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Page = () => {
    return (
        <DashboardLayout>
            <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                <Charts/>
            </div>
        </DashboardLayout>
    );
};

export default Page;