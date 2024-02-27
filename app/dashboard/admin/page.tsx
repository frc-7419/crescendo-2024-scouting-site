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

    useEffect(() => {
        const fetchMatches = async () => {
            if (eventKey) {
                try {
                    const response = await axios.get(`/api/bluealliance/getMatches/${eventKey}`, {
                        onDownloadProgress: (progressEvent) => {
                            let percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
                            setValue(percentCompleted);
                        },
                    });
                    setMatches(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            }
        };

        fetchMatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    const getShifts = async () => {
        const response = await axios.get(`/api/schedule/user/get`, {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                );
                setValue(percentCompleted);
            },
        });
        const data = await response.data;
        setShifts(data);
        console.debug(shifts);
    };

    const getEvent = async () => {
        const response = await axios.get(`/api/bluealliance/getEventInfo/${eventKey}`, {
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                );
                setValue(percentCompleted);
            },
        });
        const data = await response.data;
        setEventData(data);
        console.debug(eventData);
    };

    const preFetch = async () => {
        router.prefetch('/dashboard/scouting');
        router.prefetch('/dashboard/schedule');
    }

    useEffect(() => {
        getShifts();
        getEvent();
        setValue(0);
        preFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
