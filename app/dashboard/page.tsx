'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import { Main } from 'next/document';
import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';

const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];

    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="p-6">
                <span className="text-3xl text-white">Welcome {firstName},</span>
                <div id='cards' className="mt-4 overflow-y-auto">
                    <DashCard title="Current Match" content={<p>Match 1</p>} />
                    <DashCard title="Upcoming Matches" content={<MatchSchedule />} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
