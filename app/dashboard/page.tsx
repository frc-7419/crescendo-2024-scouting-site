'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import { Main } from 'next/document';
import React, { Suspense } from 'react';

const Dashboard = () => {
    return (
        <main className="h-screen dark:bg-slate-950">
            <SideBar />
            <NavBar />
        </main>
    );
};

export default Dashboard;
