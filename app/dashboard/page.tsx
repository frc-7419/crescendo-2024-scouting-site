import NavBar from '@/components/nav-bar';
import { Main } from 'next/document';
import React, { Suspense } from 'react';

const Dashboard = () => {
    return (
        <main className="h-screen dark:bg-slate-950">
            <NavBar />
        </main>
    );
};

export default Dashboard;
