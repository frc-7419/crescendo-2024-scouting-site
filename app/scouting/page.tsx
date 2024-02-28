'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import ScouterSchedule from '@/components/scouter-schedule';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import Axios from 'axios';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {setupCache} from "axios-cache-interceptor";
import {getMatches, getShifts} from "@/components/fetches/apicalls";
import toast from "react-hot-toast";

const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };


    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);

    const setTime = (time: number) => {
        setCurrentTime(new Date());
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        try {
            getMatches(eventKey).then(data => {
                setMatches(data);
                setLoading(false);
                setValue(100)
            })
        } catch (error) {
            toast.error('Error Loading Matches');
            setLoading(false);
            setValue(500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    useEffect(() => {
        getShifts().then(data => {
            setShifts(data);
        });
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Scouting Schedule"
                              content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                        shifts={shifts}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
