"use client"

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/currentgame';
import ScouterSchedule from '@/components/scouter-schedule';
import Axios from 'axios';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {Event} from '@/types/Event';
import Loading from '@/components/loading';
import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import {setupCache} from "axios-cache-interceptor";
import {getEvent, getMatches, getShifts} from "@/components/fetches/bluealliance";
import {LoadStatusContext} from "@/components/LoadStatusContext";
import {useRouter} from "next/navigation";


const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];

    const {value, setValue} = React.useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const router = useRouter();
    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    const preFetch = () => {
        router.prefetch('/dashboard/scouting');
        router.prefetch('/dashboard/schedule');
    }

    useEffect(() => {
        try {
            setValue(0);
            getMatches(eventKey).then(data => {
                setMatches(data);
            })
            getShifts().then(data => {
                setShifts(data);
            });
            getEvent(eventKey).then(data => {
                setEventData(data)
            });
            setValue(100)
            setLoading(false)
            preFetch();
        } catch (error) {
            setValue(500)
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    const updateTime = () => {
        setCurrentTime(new Date());
    };

    const interval = setInterval(updateTime, 1000);


    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div className="pt-6 pr-6 pl-6 flex flex-col flex-1">
                <span className="text-3xl">Welcome {firstName},</span>
                <div className="mt-4 overflow-y-auto">
                    <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''}
                                 time={currentTime} shifts={shifts}/>
                    <DashCard title="Scouting Schedule"
                              content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                        shifts={shifts}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
