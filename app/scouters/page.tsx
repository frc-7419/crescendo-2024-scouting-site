'use client';

import React, {useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Match} from '@/types/match';
import {useRouter} from 'next/navigation';
import SetScouterSchedule from '@/components/set-scouter-schedule';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import Loading from '@/components/loading';
import {getMatches} from "@/components/fetches/apicalls";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Scouters = () => {
    const router = useRouter();

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
        <DashboardLayout>
            <div id='cards' className="overflow-y-scroll flex-1">
                <SetScouterSchedule matches={filteredMatches} loading={loading} time={currentTime}/>
            </div>
        </DashboardLayout>
    );
};

export default Scouters;
