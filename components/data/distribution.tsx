'use client';

import React, {useContext, useEffect, useState} from 'react';
import {LoadStatusContext} from '../loading/LoadStatusContext';
import {getAverages, getBests} from "@/components/fetches/apicalls";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {AvgModal, BestModal} from "@/types/scoutingform";
import {ScatterChart} from "@tremor/react";
import {Card, CardBody} from '@nextui-org/react';
import Loadinganim from "@/components/loading/loadinganim";

export default function Distribution() {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [allAverages, setAllAverages] = useState<AvgModal[]>([]);
    const [averagesLoaded, setAveragesLoaded] = useState(false)
    const [allBest, setAllBest] = useState<BestModal[]>([]);
    const [bestsLoaded, setBestsLoaded] = useState(false)
    const [errored, setErrored] = useState(false)

    const fetchAllAverages = async () => {
        if (averagesLoaded) return;
        try {
            const averages = await getAverages(getCurrentEvent())
            setAllAverages(averages);
            setAveragesLoaded(true)
            setValue(100);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setValue(500);
        }
    }

    const fetchAllBest = async () => {
        if (bestsLoaded) return;
        try {
            const bests = await getBests(getCurrentEvent())
            setAllBest(bests);
            setBestsLoaded(true)
            setValue(100);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setValue(500);
        }
    }

    useEffect(() => {
        fetchAllAverages()
        fetchAllBest()
    }, []);

    return (
        !averagesLoaded && !bestsLoaded ? (
            <div className={"p-2"}>
                <Loadinganim/>
            </div>
        ) : (
            errored ? (
                <div className={"p-2"}>
                    <p>There was an error loading the Data</p>
                </div>
            ) : (
                <>
                    <Card
                        isBlurred
                        className='mt-4'
                    >
                        <CardBody>
                            <p className={'p-2 text-lg'}>Point Average:</p>
                            <ScatterChart
                                className="h-96"
                                data={allAverages.map(entry => ({
                                    'Team': entry.teamNumber,
                                    'Auton Total': entry.avgampauton + entry.avgspeakerauton,
                                    'Teleop Total': entry.avgampteleop + entry.avgspeakerteleop
                                }))}
                                category="Team"
                                x="Auton Total"
                                y="Teleop Total"
                                showOpacity={true}
                                showLegend={false}
                                valueFormatter={{
                                    x: (notes) => `${notes} notes`,
                                    y: (notes) => `${notes} notes`,
                                }}
                            />
                            <p className={'p-2 text-lg'}>Best Match:</p>
                            <ScatterChart
                                className="h-96"
                                data={allBest.map(entry => ({
                                    'Team': entry.teamNumber,
                                    'Auton Total': entry.ampauton + entry.speakerauton,
                                    'Teleop Total': entry.ampteleop + entry.speakerteleop
                                }))}
                                category="Team"
                                x="Auton Total"
                                y="Teleop Total"
                                showOpacity={true}
                                showLegend={false}
                                valueFormatter={{
                                    x: (notes) => `${notes} notes`,
                                    y: (notes) => `${notes} notes`,
                                }}
                            />
                        </CardBody>
                    </Card>
                </>
            )
        )
    )
}