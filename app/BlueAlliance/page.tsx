import React from 'react';
import BlueAllianceComponent from '@/components/bluealliancecomponent';
import SideBar from '@/components/side-bar';
import NavBar from '@/components/nav-bar';
import DashCard from '@/components/templates/dash-card';

const Page = () => {
    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="overflow-auto lg:overflow-hidden pt-6 pr-6 pl-6">
                <DashCard title="Blue Alliance Team Information" content={<BlueAllianceComponent/>}/>
            </div>

        </main>
    );
};

export default Page;
