'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Match} from '@/types/match';
import {useRouter} from 'next/navigation';
import SetScouterSchedule from '@/components/set-scouter-schedule';
import Axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import Loading from '@/components/loading';
import {setupCache} from "axios-cache-interceptor";

const Scouters = () => {
    const router = useRouter();
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];


    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

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
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading) return;
        console.debug(loading)
        setLoading(true);
        if (eventKey) {
            axios.get(`/api/bluealliance/getMatches/${eventKey}`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                }
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

    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="p-6 flex flex-col">
                <div id='cards' className="overflow-y-scroll flex-1">
                    <SetScouterSchedule matches={filteredMatches} loading={loading} time={currentTime}/>
                </div>
            </div>
        </main>
    );
};

export default Scouters;
