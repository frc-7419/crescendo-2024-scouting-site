"use client"

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/schedules/currentgame';
import ScouterSchedule from '@/components/schedules/scouter-schedule';
import {getCurrentEvent} from '@/components/util/getCurrentEvent';
import {Event} from '@/types/Event';
import Loading from '@/components/loading/loading';
import {getEvent, getMatches, getShifts} from "@/components/fetches/apicalls";
import {LoadStatusContext} from "@/components/loading/LoadStatusContext";
import {useRouter} from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";


const Dashboard = () => {
    const {data: session} = useSession({
        required: true
    });
    const firstName = session?.user?.name?.split(" ")[0];

    const {setValue} = React.useContext(LoadStatusContext) as {
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
        try {
            router.prefetch('/scouting');
            router.prefetch('/schedule');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        try {
            setValue(0);
            getMatches(eventKey).then(data => {
                setMatches(data);
                //take own
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
