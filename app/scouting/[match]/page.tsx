'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, { Suspense, useEffect, useState } from 'react';
import ScoutingForm from '@/components/scoutingform';
import { set } from 'zod';
import { Spinner } from '@nextui-org/react';
import { ScoutingFormData } from '@/types/form';

const Scouting = ({ params }: { params: { match: string } }) => {
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({} as ScoutingFormData)
    const [errored, setErrored] = useState(false);

    const getForm = async () => {
        try {
            const res = await fetch(`/api/schedule/user/get/form?matchId=${params.match}`);
            const data = await res.json();
            console.log(data);
            setForm(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        getForm();
    }, []);

    if (loading) {
        return (
            <main className="h-screen overflow-clip dark:bg-slate-950">
                <SideBar />
                <NavBar />
                <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                    <div className='flex justify-between'>
                        <span className="text-3xl">Currently Scouting</span>
                        <span className="text-3xl"><Spinner /></span>
                    </div>
                    <div id='cards' className="mt-4 overflow-y-auto flex-1">
                        <div>Loading...</div>
                    </div>
                </div>
            </main>
        );
    }

    if (errored) {
        return (
            <main className="h-screen overflow-clip dark:bg-slate-950">
                <SideBar />
                <NavBar />
                <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                    <div id='cards' className="mt-4 overflow-y-auto flex-1">
                        <div>Error occurred while loading form.</div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div className='flex justify-between'>
                    <span className="text-3xl">Currently Scouting</span>
                    <span className="text-3xl">Qual {form.matchNumber} - Team {form.team}</span>
                </div>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <ScoutingForm formData={form} />
                </div>
            </div>
        </main>
    );
};

export default Scouting;
