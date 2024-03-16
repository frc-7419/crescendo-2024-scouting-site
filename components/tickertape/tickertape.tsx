'use client';

import React, {useEffect, useState} from 'react';
import {getTopTeamsCont} from '@/components/fetches/apicalls';
import {getCurrentEvent} from '@/components/util/getCurrentEvent';
import {SparkAreaChart} from '@tremor/react';
import {Divider} from "@nextui-org/react";
import styles from "./tickertape.module.css";
import {TickerData} from "@/types/TickerData";

export default function Tickertape() {
    const [topTeams, setTopTeams] = useState<TickerData[]>([]);
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
                {topTeams.map((team, index) => (
                    <div key={team.teamNumber}
                         className={'flex w-72 gap-2 items-center px-2 dark:bg-slate-900 bg-slate-100'}>
                        <div className={'flex flex-col w-20'}>
                            <p className={'text-sm'}>#{index + 1} {team.teamNumber}</p>
                            <span
                                className={`rounded w-14 px-1 text-sm font-medium text-white ${team.continuousAverage.slice(-1)[0].percentChange < 0 ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                {team.continuousAverage.slice(-1)[0].percentChange}%
                            </span>
                        </div>
                        <SparkAreaChart
                            data={team.continuousAverage}
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
