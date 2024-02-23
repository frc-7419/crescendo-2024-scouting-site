'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import CurrentGame from '@/components/currentgame';
import { Input } from '@nextui-org/react';
import { Match } from '@/types/match';
import ScouterSchedule from '@/components/scouter-schedule';
import { LoadStatusContext } from '@/components/LoadStatusContext';
import axios from 'axios';
import { getCurrentEvent } from '@/components/getCurrentEvent';
import { Event } from '@/types/Event';
import Loading from '@/components/loading';

const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const { value, setValue } = useContext(LoadStatusContext) as { value: number; setValue: React.Dispatch<React.SetStateAction<number>> };

    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    const setTime = (time: number) => {
        const date = new Date();
        const timee = new Date(time * 1000)
        setCurrentTime(timee);
    }

    useEffect(() => {
        if (eventKey) {
            axios.get(`/api/bluealliance/getMatches/${eventKey}`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                },
            })
                .then(response => response.data)
                .then(data => {
                    console.debug(data);
                    setMatches(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        }

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

    useEffect(() => {
        getShifts();
        getEvent();
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <Loading />
    }
    
    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                {/* <Input type='number' placeholder='time' defaultValue='1679270078' onChange={(e) => setTime(Number(e.target.value))} /> */}
                <span className="text-3xl">Welcome {firstName},</span>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''} time={currentTime} shifts={shifts} />
                    <DashCard title="Scouting Schedule" content={<ScouterSchedule matches={matches} loading={loading} time={currentTime} shifts={shifts} />} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
