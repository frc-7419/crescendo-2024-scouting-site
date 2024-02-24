"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/currentgame';
import ScouterSchedule from '@/components/scouter-schedule';
import axios from 'axios';
import { getCurrentEvent } from '@/components/getCurrentEvent';
import { Event } from '@/types/Event';
import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';

const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];

    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchesResponse, shiftsResponse, eventResponse] = await Promise.all([
                    axios.get(`/api/bluealliance/getMatches/${eventKey}`),
                    axios.get(`/api/schedule/user/get`),
                    axios.get(`/api/bluealliance/getEventInfo/${eventKey}`)
                ]);

                setMatches(matchesResponse.data);
                setShifts(shiftsResponse.data);
                setEventData(eventResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        if (eventKey) {
            fetchData();
        }
    }, [eventKey]);

    const setTime = (time: number) => {
        const timee = new Date(time * 1000);
        setCurrentTime(timee);
    }

    return (
        <main className="min-h-screen flex flex-col lg:flex-row overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div className="lg:w-4/5">
                <div className="pt-6 pr-6 pl-6 flex flex-col flex-1">
                    <span className="text-3xl">Welcome {firstName},</span>
                    <div className="mt-4 overflow-y-auto">
                        <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''} time={currentTime} shifts={shifts} />
                        <DashCard title="Scouting Schedule" content={<ScouterSchedule matches={matches} loading={loading} time={currentTime} shifts={shifts} />} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
