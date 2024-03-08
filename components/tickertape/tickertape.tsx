'use client';

import React, {useEffect, useState} from 'react';
import {getTopTeamsCont} from '@/components/fetches/apicalls';
import {getCurrentEvent} from '@/components/util/getCurrentEvent';
import {SparkAreaChart} from '@tremor/react';
import {Divider} from "@nextui-org/react";
import styles from "./tickertape.module.css";

export default function Tickertape() {
    const [topTeams, setTopTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    const getTopTeams = async () => {
        setErrored(false);
        try {
            const teamsData = await getTopTeamsCont(getCurrentEvent());
            setTopTeams(teamsData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        getTopTeams();
    }, []);

    return (
        <div className={'dark:bg-slate-900 bg-slate-100 overflow-hidden'}>
            <div className={`h-16 max-w-full dark:bg-slate-900 bg-slate-100 flex ${styles.scrollContainer}`}>
                {Object.keys(topTeams).map((teamId, index) => (
                    <div key={teamId} className={'flex w-72 gap-2 items-center px-2 dark:bg-slate-900 bg-slate-100'}>
                        <div className={'flex flex-col w-20'}>
                            <p className={'text-sm'}>#{index + 1} {teamId}</p>
                            <span
                                className={`rounded w-14 px-1 text-sm font-medium text-white ${topTeams[teamId as any]?.[topTeams[teamId as any]?.length - 1].percentChange < 0 ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                {topTeams[teamId as any]?.[topTeams[teamId as any]?.length - 1].percentChange}%
                            </span>
                        </div>
                        <SparkAreaChart
                            data={topTeams[teamId as any]}
                            categories={['continuousAverage']}
                            index={'match'}
                            colors={['blue']}
                            className="h-10"
                        />
                        <Divider orientation="vertical"/>
                    </div>
                ))}
            </div>
        </div>
    );
}
