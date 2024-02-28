'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import ScoutingForm from '@/components/scoutingform';
import {Spinner} from '@nextui-org/react';
import {ScoutingFormData} from '@/types/form';
import Axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import ProxyProvider from '@/components/unsavedprovider';
import {setupCache} from "axios-cache-interceptor";
import {getFormData} from "@/components/fetches/apicalls";

const Scouting = ({params}: { params: { match: string } }) => {
    const instance = Axios.create();
    const axios = setupCache(instance);
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({} as ScoutingFormData)
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        try {
            setValue(0);
            getFormData(params.match).then(data => {
                setForm(data);
            })
            setValue(100)
        } catch (error) {
            setValue(500)
            console.error(error);
        }
        setLoading(false)
    }, [params.match, setValue]);

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
            <ProxyProvider>
                <SideBar/>
                <NavBar/>
                <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                    <div className='flex justify-between'>
                        <span className="text-3xl">Currently Scouting</span>
                        {loading && <Spinner/>}
                        {!loading && !errored &&
                            <span className="text-3xl">Qual {form.matchNumber} - Team {form.team}</span>}
                    </div>
                    <div id='cards' className="mt-4 overflow-y-auto flex-1">
                        {loading && <div>Loading...</div>}
                        {!loading && errored && <div>Error occurred while loading form.</div>}
                        {!loading && !errored && <ScoutingForm formData={form}/>}
                    </div>
                </div>
            </ProxyProvider>
        </main>
    );
};

export default Scouting;
