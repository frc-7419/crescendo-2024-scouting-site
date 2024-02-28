'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/currentgame';
import {Tab, Tabs} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import ScouterSchedule from '@/components/scouter-schedule';
import AdminMatchSchedule from '@/components/scheduleAdmin';
import Axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {Event} from '@/types/Event';
import Loading from '@/components/loading';
import {setupCache} from "axios-cache-interceptor";
import {getEvent, getMatches, getShifts} from "@/components/fetches/bluealliance";

const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {value, setValue} = React.useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const router = useRouter();
    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));

    const [selectedTab, setSelectedTab] = useState("admin")

    const updateTime = (time: number) => {
        setCurrentTime(new Date());
    }

    const interval = setInterval(() => {
        updateTime(0);
    }, 1000);


    useEffect(() => {
        if (session?.user?.role) {
            if (!(session?.user?.role === "ADMIN" || session?.user?.role === "SITEADMIN")) {
                alert(session?.user?.role)
                router.push("/dashboard/user")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => {
        console.debug(selectedTab)
    }, [selectedTab]);

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

    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div className="pt-6 pr-6 pl-6 flex flex-col flex-1">
                <div className='header flex justify-between'>
                    <span className="text-3xl">Welcome {firstName},</span>
                    <Tabs
                        aria-label="Tabs colors"
                        radius="full"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(String(key))}
                    >
                        <Tab key="admin" title="Admin"/>
                        <Tab key="scouter" title="Scouter"/>
                    </Tabs>
                </div>
                <div id='cards' className="mt-4 overflow-y-auto">
                    <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''}
                                 time={currentTime} shifts={shifts}/>

                    {selectedTab === "admin" ? (<DashCard title="Scouting Schedule"
                                                          content={<AdminMatchSchedule matches={matches}
                                                                                       loading={loading}
                                                                                       time={currentTime}/>}/>) : (
                        <DashCard title="Scouting Schedule"
                                  content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                            shifts={shifts}/>}/>)}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
