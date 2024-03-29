'use client';

import React, {useContext, useEffect, useState} from 'react';
import DashCard from '@/components/templates/dash-card';
import MatchSchedule from '@/components/schedules/schedule';
import {LoadStatusContext} from '@/components/loading/LoadStatusContext';
import {getCurrentEvent} from '@/components/util/getCurrentEvent';
import Loading from '@/components/loading/loading';
import {getMatches} from "@/components/fetches/apicalls";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Schedule = () => {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1679270078 * 1000));


    const setTime = () => {
        setCurrentTime(new Date());
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime();
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
                setValue(100)
            })
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
        <DashboardLayout>
            <div id='cards' className="mt-4 overflow-y-auto flex-1">
                <DashCard title="Upcoming Matches"
                          content={<MatchSchedule matches={matches} loading={loading} time={currentTime}/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Schedule;
