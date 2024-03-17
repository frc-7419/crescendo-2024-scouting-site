'use client';

import React, {useContext, useEffect, useState} from 'react';
import ScoutingForm from '@/components/scouting/scoutingform';
import {Spinner} from '@nextui-org/react';
import {ScoutingFormData} from '@/types/form';
import {LoadStatusContext} from '@/components/loading/LoadStatusContext';
import ProxyProvider from '@/components/util/unsavedprovider';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {useSession} from 'next-auth/react';
import {useRouter, useSearchParams} from "next/navigation";
import toast from "react-hot-toast";
import Loadinganim from "@/components/loading/loadinganim";

const Scouting = () => {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({} as ScoutingFormData)
    const [errored] = useState(false);
    const {data: session} = useSession();
    const searchParams = useSearchParams()

    const robot = searchParams.get('robot')
    const router = useRouter()
    if (!robot) {
        toast.error('No robot number provided')
        router.push('/scouting')
    }

    useEffect(() => {
        try {
            setValue(0);
            const scoutData: ScoutingFormData = {
                matchId: 'PRACTICE',
                matchNumber: 999,
                venue: getCurrentEvent(),
                scouterId: session?.user?.id ?? '',
                role: 'BLUEONE',
                team: robot ?? '',
                alliance: 'BLUE',
            };

            setForm(scoutData)
            setValue(100)
        } catch (error) {
            setValue(500)
            console.error(error);
        }
        setLoading(false)
    }, [robot, setValue]);

    if (errored) {
        return (
            <div id='cards' className="mt-4 overflow-y-auto flex-1">
                <div>Error occurred while loading form.</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <ProxyProvider>
                <div className='flex justify-between'>
                    <span className="text-3xl">Currently Scouting</span>
                    {loading && <Spinner/>}
                    {!loading && !errored &&
                        <span className="text-3xl">Qual {form.matchNumber} - Team {form.team}</span>}
                </div>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    {loading && <Loadinganim/>}
                    {!loading && errored && <div>Error occurred while loading form.</div>}
                    {!loading && !errored && <ScoutingForm formData={form}/>}
                </div>
            </ProxyProvider>
        </DashboardLayout>
    );
};

export default Scouting;
