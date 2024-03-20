'use client';

import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Invites from "@/components/settings/invites";
import DashCard from "@/components/templates/dash-card";

const Settings = () => {
    return (
        <DashboardLayout>
            <div id='cards' className="overflow-y-scroll flex-1">
                <DashCard title="Invites"
                          content={<Invites/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
