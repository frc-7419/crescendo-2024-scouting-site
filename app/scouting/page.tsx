'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import ScouterSchedule from '@/components/scouter-schedule';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import Axios from 'axios';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {setupCache} from "axios-cache-interceptor";

const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);
    
    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };


    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);

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

    useEffect(() => {
        getShifts();
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">
                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Scouting Schedule"
                              content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                        shifts={shifts}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
