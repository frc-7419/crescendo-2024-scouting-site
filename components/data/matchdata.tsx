'use client';

import React, {useContext, useEffect, useState} from 'react';
import {Accordion, AccordionItem, Input, Tab, Tabs} from '@nextui-org/react';
import {LoadStatusContext} from '../loading/LoadStatusContext';
import {getMatch} from "@/components/fetches/apicalls";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import Justthedata from "@/components/data/justthedata";
import Loadinganim from "@/components/loading/loadinganim";
import {BestModal} from "@/types/scoutingform";
import axios from "axios";

const eventName = getCurrentEvent();

interface TeamList {
    red: string[],
    blue: string[]
}

const MemoizedJustthedata = React.memo(Justthedata);

export default function MatchData() {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [matchNumber, setMatchNumber] = useState(0);
    const [match, setMatch] = useState<any>();
    const [teamList, setTeamList] = useState<TeamList>();
    const [allBests, setAllBests] = useState<BestModal[]>();
    const [maxPointsWithoutFoulsRed, setMaxPointsWithoutFoulsRed] = useState<number>(0);
    const [maxPointsWithoutFoulsBlue, setMaxPointsWithoutFoulsBlue] = useState<number>(0);
    const loadGame = async () => {
        try {
            setValue(0);
            setLoading(true);
            const matchID = `${eventName}_qm${matchNumber}`;
            const data = await getMatch(matchID)
            setMatch(data);
            setValue(100);
            setErrored(false);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setLoading(false);
            setValue(500);
        }
    }

    useEffect(() => {
        if (!match) return;
        let teams: { red: string[], blue: string[] } = {
            red: [],
            blue: []
        };
        match.alliances.red.team_keys.map((teamKey: string) => (
            teams.red.push(teamKey.replace("frc", ""))
        ))
        match.alliances.blue.team_keys.map((teamKey: string) => (
            teams.blue.push(teamKey.replace("frc", ""))
        ))
        setTeamList(teams);
    }, [match]);

    const getAllBests = async () => {
        try {
            let teams: string[] = [];
            teamList?.red.map((team) => teams.push(team));
            teamList?.blue.map((team) => teams.push(team));
            const response = await axios.get(`/api/data/robots/?type=best&teams=${teams.join(',')}`);
            setAllBests(response.data);
            setValue(100);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setLoading(false);
            setValue(500);
        }
    }

    useEffect(() => {
        getAllBests()
    }, [teamList])

    const parseBests = (teamNumbers: string[] | undefined) => {
        if (!teamNumbers) return undefined;
        const relevantBests = allBests?.filter(best => teamNumbers.includes(best.teamNumber));
        if (relevantBests) {
            const maxAutonSpeaker = relevantBests.reduce((sum, best) => sum + best.speakerauton, 0);
            const maxAutonAmp = relevantBests.reduce((sum, best) => sum + best.ampauton, 0);
            const maxAutonNotes = maxAutonSpeaker + maxAutonAmp;
            const maxAutonPoints = (maxAutonSpeaker * 5) + (maxAutonAmp * 2) + (2 * 3); // assume leave community

            const maxTeleopSpeaker = relevantBests.reduce((sum, best) => sum + best.speakerteleop, 0);
            const maxTeleopAmp = relevantBests.reduce((sum, best) => sum + best.ampteleop, 0);

            const avaliableAmplifications = Math.floor(maxTeleopAmp / 2);
            const maxAmpedNotesInTimeFrame = 3 // Reasonable assumption. Very possible to get more but keeping like this for now.
            const baseTeleopPoints = (maxTeleopSpeaker * 2) + (maxTeleopAmp)

            let topTeleopPoints;
            let teleopRange;

            if (avaliableAmplifications >= 1) {
                if (maxTeleopSpeaker <= maxAmpedNotesInTimeFrame * avaliableAmplifications) {
                    topTeleopPoints = (maxTeleopSpeaker * 5) + (maxTeleopAmp)
                } else {
                    topTeleopPoints = (maxTeleopSpeaker - (maxAmpedNotesInTimeFrame * avaliableAmplifications)) * 2 + ((maxAmpedNotesInTimeFrame * avaliableAmplifications) * 5) + (maxTeleopAmp);
                }
                teleopRange = `${baseTeleopPoints} - ${topTeleopPoints}`;
            } else {
                teleopRange = `${baseTeleopPoints}`;
                topTeleopPoints = baseTeleopPoints;
            }

            const maxTrap = relevantBests.reduce((sum, best) => sum + best.trap, 0);
            const robotsWithHang = relevantBests.filter(best => best.hang).length;

            const baseendgame = (maxTrap * 5) + ((robotsWithHang) > 1 ? robotsWithHang * 6 : (robotsWithHang * 3) + (robotsWithHang - 1) * 2) + (3 - robotsWithHang);
            const topEndgame = baseendgame + robotsWithHang;
            const endgameRange = `${baseendgame} - ${topEndgame}`;

            return {
                maxAutonSpeaker,
                maxAutonAmp,
                maxAutonNotes,
                maxAutonPoints,
                maxTeleopSpeaker,
                maxTeleopAmp,
                teleopRange,
                topTeleopPoints,
                baseTeleopPoints,
                baseendgame,
                maxTrap,
                robotsWithHang,
                topEndgame,
                endgameRange
            };
        }
    }
    return (
        <>
            <div className='flex'>
                <Input
                    fullWidth
                    autoComplete='off'
                    type="number"
                    onChange={(e) => setMatchNumber(parseInt(e.target.value))}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            loadGame();
                        }
                    }}
                    placeholder="Enter match number"
                />
            </div>
            {loading ? <Loadinganim/> : errored ?
                <p>No data available. Please enter a valid match number.</p> : match ? <>
                    <div
                        className="dark:bg-slate-900 bg-slate-200 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                        <div className='allianceView flex flex-col justify-between flex-grow mx-6'>
                            <div className="blueAllianceView bg-blue-600/60 h-20 rounded-b-lg items-center">
                                {
                                    teamList?.blue.map((teamKey: string) => (
                                        <div key={teamKey}
                                             className="flex-grow text-center text-2xl">{teamKey}</div>
                                    ))
                                }
                            </div>
                            <h1 className="currentEvent text-2xl tracking-widest font-semibold event text-center py-4">Qual {match.match_number}</h1>
                            <div className="redAllianceView bg-red-600/60 h-20 rounded-t-lg items-center">
                                {
                                    teamList?.red.map((teamKey: string) => (
                                        <div key={teamKey}
                                             className="flex-grow text-center text-2xl">{teamKey}</div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <p className={'text-2xl'}>Estimates/Maxes</p>
                    <div className="grid grid-cols-2 w-full gap-4 py-4">
                        {(() => {
                            const parsedDataBlue = parseBests(teamList?.blue);
                            const maxPointsWithoutFoulsBlue = parsedDataBlue?.maxAutonPoints != null && parsedDataBlue?.topEndgame != null && parsedDataBlue?.topTeleopPoints != null ?
                                (parsedDataBlue?.topEndgame + parsedDataBlue?.topTeleopPoints + parsedDataBlue?.maxAutonPoints) : 0;
                            const parsedDataRed = parseBests(teamList?.red);
                            const maxPointsWithoutFoulsRed = parsedDataRed?.maxAutonPoints != null && parsedDataRed?.topEndgame != null && parsedDataRed?.topTeleopPoints != null ?
                                (parsedDataRed?.topEndgame + parsedDataRed?.topTeleopPoints + parsedDataRed?.maxAutonPoints) : 0;
                            return (
                                <>
                                    <div className={'rounded-lg bg-blue-900 p-4'}>
                                        <div className={'flex'}>
                                            <p className="text-2xl grow">Blue Alliance</p>
                                            <p className="text-2xl">{(maxPointsWithoutFoulsRed <= maxPointsWithoutFoulsBlue ? 1 : 0)}</p>
                                        </div>
                                        <Accordion>
                                            <AccordionItem title={"Auton"}>
                                                <p>Max Speaker Notes: {parsedDataBlue?.maxAutonSpeaker} notes</p>
                                                <p>Max Amp Notes: {parsedDataBlue?.maxAutonAmp} notes</p>
                                                <p>Max Notes: {parsedDataBlue?.maxAutonNotes} notes</p>
                                                <p>Max Auton Points: {parsedDataBlue?.maxAutonPoints} points</p>
                                            </AccordionItem>
                                            <AccordionItem title={"Teleop"}>
                                                <p>Max Speaker: {parsedDataBlue?.maxTeleopSpeaker} notes</p>
                                                <p>Max Amp: {parsedDataBlue?.maxTeleopAmp} notes</p>
                                                <p>Max Teleop Points: {parsedDataBlue?.teleopRange} points</p>
                                            </AccordionItem>
                                            <AccordionItem title={"Endgame"}>
                                                <p>Max Trap: {parsedDataBlue?.maxTrap} notes</p>
                                                <p>Robots with Hang: {parsedDataBlue?.robotsWithHang} robots</p>
                                                <p>Max Endgame Points: {parsedDataBlue?.endgameRange} points</p>
                                            </AccordionItem>
                                        </Accordion>
                                        <p>
                                            Maximum Total Points w/o
                                            Fouls: {maxPointsWithoutFoulsBlue}
                                        </p>
                                    </div>
                                    <div className={'rounded-lg bg-red-900 p-4'}>
                                        <div className={'flex'}>
                                            <p className="text-2xl grow">{(maxPointsWithoutFoulsRed >= maxPointsWithoutFoulsBlue ? 1 : 0)}</p>
                                            <p className="text-2xl text-right">Red Alliance</p>
                                        </div>
                                        <Accordion>
                                            <AccordionItem title={"Auton"}>
                                                <p>Max Speaker Notes: {parsedDataRed?.maxAutonSpeaker} notes</p>
                                                <p>Max Amp Notes: {parsedDataRed?.maxAutonAmp} notes</p>
                                                <p>Max Notes: {parsedDataRed?.maxAutonNotes} notes</p>
                                                <p>Max Auton Points: {parsedDataRed?.maxAutonPoints} points</p>
                                            </AccordionItem>
                                            <AccordionItem title={"Teleop"}>
                                                <p>Max Speaker: {parsedDataRed?.maxTeleopSpeaker} notes</p>
                                                <p>Max Amp: {parsedDataRed?.maxTeleopAmp} notes</p>
                                                <p>Max Teleop Points: {parsedDataRed?.teleopRange} points</p>
                                            </AccordionItem>
                                            <AccordionItem title={"Endgame"}>
                                                <p>Max Trap: {parsedDataRed?.maxTrap} notes</p>
                                                <p>Robots with Hang: {parsedDataRed?.robotsWithHang} robots</p>
                                                <p>Max Endgame Points: {parsedDataRed?.endgameRange} points</p>
                                            </AccordionItem>
                                        </Accordion>
                                        <p>
                                            Maximum Total Points w/o
                                            Fouls: {maxPointsWithoutFoulsRed}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                    <p className={'text-2xl'}>Data</p>
                    <Tabs aria-label="Team Tabs" fullWidth>
                        {teamList && teamList.blue.map((teamNumber) => (
                            <Tab key={teamNumber} title={teamNumber}>
                                <MemoizedJustthedata teamNumber={teamNumber}/>
                            </Tab>
                        ))
                        }
                        {teamList && teamList.red.map((teamNumber) => (
                            <Tab key={teamNumber} title={teamNumber}>
                                <MemoizedJustthedata teamNumber={teamNumber}/>
                            </Tab>
                        ))
                        }
                    </Tabs>
                </> : <p>No data available. Please enter a valid match number.</p>}
        </>
    );
}