'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, { FormEvent, Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import CurrentGame from '@/components/currentgame';
import { Input, Tabs, Tab, Button } from '@nextui-org/react';
import { Match } from '@/types/Match';
import { useRouter } from 'next/navigation';
import SetScouterSchedule from '@/components/set-scouter-schedule';

const Scouters = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];


    const [eventKey, seteventKey] = useState('2023cafr');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));

    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

    useEffect(() => {
        const filtered = matches.filter((match: Match) => match.comp_level == "qm");
        setFilteredMatches(filtered);
    }, [matches]);

    useEffect(() => {
        if (session?.user?.role) {
            if (!(session?.user?.role === "ADMIN" || session?.user?.role === "SITEADMIN")) {
                alert(session?.user?.role)
                router.push("/")
            }
        }
    }, [session]);

    useEffect(() => {
        if (eventKey) {
            fetch(`/api/bluealliance/getMatches/${eventKey}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setMatches(data);
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
            <div id='dash' className="p-6 flex flex-col">
                <div id='cards' className="overflow-y-scroll flex-1">
                    <SetScouterSchedule matches={filteredMatches} loading={loading} time={currentTime} />
                </div>
            </div>
        </main>
    );
};

export default Scouters;
