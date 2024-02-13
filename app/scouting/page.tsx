'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import { Main } from 'next/document';
import React, { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import CurrentGame from '@/components/currentgame';
import { Input } from '@nextui-org/react';
import { space } from 'postcss/lib/list';
import AutonForm from '@/components/auton-form';

const Dashboard = () => {
    const [eventKey, seteventKey] = useState('2023casf');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1679270078*1000));


    const setTime= (time: number) => {
        const date = new Date();
        const timee = new Date(time * 1000)
        setCurrentTime(timee);
    }

    // useEffect(() => {
    //     if (eventKey) {
    //         fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
    //             headers: new Headers({
    //                 'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
    //             })
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log(data);
    //                 const sortedMatches = data.sort((a: Match, b: Match) => a.predicted_time - b.predicted_time);
    //                 setMatches(sortedMatches);
    //                 setLoading(false);
    //             })
    //             .catch(error => {
    //                 console.error(error);
    //                 setLoading(false);
    //             });
    //     }
    // }, [eventKey]);
    
    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
            <SideBar />
            <NavBar />
            <div id='dash' className="flex flex-row justify-center space-x-[620px]">
                <span className="text-3xl">Currently Scouting</span>
                <span className="text-3xl mr-12">Qual 52 - Team 7419</span>
            </div>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div id='cards' className="mt-[50px] overflow-y-auto flex-1">
                    <DashCard title="Auton" content={<AutonForm/>} size="text-4xl font-thin"/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
