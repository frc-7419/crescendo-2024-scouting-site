'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import CurrentGame from '@/components/currentgame';
import { Input } from '@nextui-org/react';
import { Match } from '@/types/match';
import ScouterSchedule from '@/components/scouter-schedule';

const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];


    const [eventKey, seteventKey] = useState('2023cafr');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);

    const setTime = (time: number) => {
        const date = new Date();
        const timee = new Date(time * 1000)
        setCurrentTime(timee);
    }

    useEffect(() => {
        if (eventKey) {
            fetch(`/api/bluealliance/getMatches/${eventKey}`)
                .then(response => response.json())
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
    }, [eventKey]);

    const getShifts = async () => {
        const response = await fetch(`/api/schedule/user/get`);
        const data = await response.json();
        setShifts(data);
        console.log(shifts);
    };

    useEffect(() => {
        getShifts();
    }, []);

    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <Input type='number' placeholder='time' defaultValue='1679270078' onChange={(e) => setTime(Number(e.target.value))} />
                <span className="text-3xl">Welcome {firstName},</span>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <CurrentGame matches={matches} loading={loading} eventName="Arizona East Regionals" time={currentTime} shifts={shifts} />
                    <DashCard title="Scouting Schedule" content={<ScouterSchedule matches={matches} loading={loading} time={currentTime} shifts={shifts} />} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
