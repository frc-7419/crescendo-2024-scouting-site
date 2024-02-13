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

const Dashboard = () => {
    const [eventKey, seteventKey] = useState('2023casf');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1679270078 * 1000));


    const setTime = (time: number) => {
        const date = new Date();
        const timee = new Date(time * 1000)
        setCurrentTime(timee);
    }

    useEffect(() => {
        if (eventKey) {
            fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
                headers: new Headers({
                    'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.debug(data);
                    const sortedMatches = data.sort((a: Match, b: Match) => a.predicted_time - b.predicted_time);
                    setMatches(sortedMatches);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [eventKey]);

    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <Input type='number' placeholder='time' defaultValue='1679270078' onChange={(e) => setTime(Number(e.target.value))} />
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Upcoming Matches" content={<MatchSchedule matches={matches} loading={loading} time={currentTime} />} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
