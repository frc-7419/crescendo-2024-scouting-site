'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedule';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import Loading from '@/components/loading';

const Dashboard = () => {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1679270078 * 1000));


    const setTime = (time: number) => {
        const date = new Date();
        const timee = new Date(time * 1000)
        setCurrentTime(timee);
    }

    useEffect(() => {
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <Input type='number' placeholder='time' defaultValue='1679270078'
                       onChange={(e) => setTime(Number(e.target.value))}/>
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Upcoming Matches"
                              content={<MatchSchedule matches={matches} loading={loading} time={currentTime}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
