"use client"

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/currentgame';
import ScouterSchedule from '@/components/scouter-schedule';
import Axios from 'axios';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {Event} from '@/types/Event';
import Loading from '@/components/loading';
import {setupCache} from "axios-cache-interceptor";
import {getEvent, getMatches, getShifts} from "@/components/fetches/apicalls";
import {LoadStatusContext} from "@/components/LoadStatusContext";
import {useRouter} from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";


const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];

    const {value, setValue} = React.useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const router = useRouter();
    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    const preFetch = () => {
        router.prefetch('/dashboard/scouting');
        router.prefetch('/dashboard/schedule');
    }

    useEffect(() => {
        try {
            setValue(0);
            getMatches(eventKey).then(data => {
                setMatches(data);
            })
            getShifts().then(data => {
                setShifts(data);
            });
            getEvent(eventKey).then(data => {
                setEventData(data)
            });
            setValue(100)
            preFetch();
        } catch (error) {
            setValue(500)
            console.error(error);
        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    const updateTime = () => {
        setCurrentTime(new Date());
    }

    useEffect(() => {
        const id = setInterval(() => {
            updateTime();
        }, 1000)
        return () => clearInterval(id);
    }, [currentTime]);


    if (loading) {
        return <Loading/>
    }

    return (
        <DashboardLayout>
            <span className="text-3xl">Welcome {firstName},</span>
            <div className="mt-4 overflow-y-auto">
                <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''}
                             time={currentTime} shifts={shifts}/>
                <DashCard title="Scouting Schedule"
                          content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                    shifts={shifts}/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
