'use client';

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import DashCard from '@/components/templates/dash-card';
import CurrentGame from '@/components/currentgame';
import {Tab, Tabs} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import ScouterSchedule from '@/components/scouter-schedule';
import AdminMatchSchedule from '@/components/scheduleAdmin';
import Axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import {Event} from '@/types/Event';
import Loading from '@/components/loading';
import {setupCache} from "axios-cache-interceptor";
import {getEvent, getMatches, getShifts} from "@/components/fetches/apicalls";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import enforceAdmin from "@/components/util/enforceadmin";

const Dashboard = () => {
    const instance = Axios.create();
    const axios = setupCache(instance);

    const {value, setValue} = React.useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const router = useRouter();
    const {data: session} = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const [shifts, setShifts] = useState([]);
    const [eventData, setEventData] = useState<Event>();

    const eventKey = getCurrentEvent();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date(1678554428 * 1000));

    const [selectedTab, setSelectedTab] = useState("admin")

    const updateTime = () => {
        setCurrentTime(new Date());
        console.debug("tick tock")
    }

    useEffect(() => {
        const id = setInterval(() => {
            updateTime();
        }, 1000)
        return () => clearInterval(id);
    }, [currentTime]);

    useEffect(() => {
        enforceAdmin(session, router);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => {
        console.debug(selectedTab)
    }, [selectedTab]);

    const preFetch = () => {
        try {
            router.prefetch('/scouting');
            router.prefetch('/schedule');
            router.prefetch('/data');
        } catch (error) {
            console.error(error);
        }
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
            preFetch();
        } catch (error) {
            console.error(error);
        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventKey]);

    useEffect(() => {
        console.debug("load", value)
    }, [value]);


    if (loading) {
        return <Loading/>
    }


    return (
        <DashboardLayout>
            <div className='header flex justify-between'>
                <span className="text-3xl">Welcome {firstName},</span>
                <Tabs
                    aria-label="Tabs colors"
                    radius="full"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(String(key))}
                >
                    <Tab key="admin" title="Admin"/>
                    <Tab key="scouter" title="Scouter"/>
                </Tabs>
            </div>
            <div id='cards' className="mt-4 overflow-y-auto">
                <CurrentGame matches={matches} loading={loading} eventName={eventData?.name || ''}
                             time={currentTime} shifts={shifts}/>

                {selectedTab === "admin" ? (<DashCard title="Scouting Schedule"
                                                      content={<AdminMatchSchedule matches={matches}
                                                                                   loading={loading}
                                                                                   time={currentTime}/>}/>) : (
                    <DashCard title="Scouting Schedule"
                              content={<ScouterSchedule matches={matches} loading={loading} time={currentTime}
                                                        shifts={shifts}/>}/>)}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
