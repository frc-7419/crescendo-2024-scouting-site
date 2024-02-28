'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import Axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import Loading from '@/components/loading';
import {setupCache} from "axios-cache-interceptor";
import {getMatches} from "@/components/fetches/apicalls";

const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1679270078 * 1000));


    const setTime = (time: number) => {
        setCurrentTime(new Date());
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(0);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTime]);

    useEffect(() => {
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            setValue(0);
            getMatches(eventKey).then(data => {
                setMatches(data);
            })
            setValue(100)
        } catch (error) {
            setValue(500)
            console.error(error);
        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Upcoming Matches"
                              content={<MatchSchedule matches={matches} loading={loading} time={currentTime}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
