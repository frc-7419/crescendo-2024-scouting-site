'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import ScoutingForm from '@/components/scoutingform';
import {Spinner} from '@nextui-org/react';
import {ScoutingFormData} from '@/types/form';
import axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import ProxyProvider from '@/components/unsavedprovider';

const Scouting = ({params}: { params: { match: string } }) => {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({} as ScoutingFormData)
    const [errored, setErrored] = useState(false);

    const getForm = async () => {
        try {
            const res = await axios.get(`/api/schedule/user/get/form?matchId=${params.match}`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                }
            });
            const data = await res.data;
            console.debug(data);
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
            <ProxyProvider>
                <main className="min-h-screen overflow-clip dark:bg-slate-950">
                    <SideBar/>
                    <NavBar/>
                    <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                        <div className='flex justify-between'>
                            <span className="text-3xl">Currently Scouting</span>
                            <span className="text-3xl"><Spinner/></span>
                        </div>
                        <div id='cards' className="mt-4 overflow-y-auto flex-1">
                            <div>Loading...</div>
                        </div>
                    </div>
                </main>
            </ProxyProvider>
        );
    }

    if (errored) {
        return (
            <main className="min-h-screen overflow-clip dark:bg-slate-950">
                <SideBar/>
                <NavBar/>
                <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                    <div id='cards' className="mt-4 overflow-y-auto flex-1">
                        <div>Error occurred while loading form.</div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div className='flex justify-between'>
                    <span className="text-3xl">Currently Scouting</span>
                    <span className="text-3xl">Qual {form.matchNumber} - Team {form.team}</span>
                </div>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <ScoutingForm formData={form}/>
                </div>
            </div>
        </main>
    );
};

export default Scouting;
