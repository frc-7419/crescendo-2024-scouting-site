'use client';

import React from 'react';
import BlueAllianceComponent from '@/components/bluealliancecomponent';
import SideBar from '@/components/side-bar';
import NavBar from '@/components/nav-bar';
import DashCard from '@/components/templates/dash-card';
import Charts from '@/components/charts';

const Page = () => {
    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                <Charts />
            </div>
        </main>
    );
};

export default Page;