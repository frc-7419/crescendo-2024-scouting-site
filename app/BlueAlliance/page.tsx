import React from 'react';
import Teamlookupcomponent from '@/components/data/teamlookupcomponent';
import DashCard from '@/components/templates/dash-card';
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Page = () => {
    return (
        <DashboardLayout>
            <div id='dash' className="overflow-auto lg:overflow-hidden pt-6">
                <DashCard title="Blue Alliance Team Information" content={<Teamlookupcomponent/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Page;
