'use client';

import React, {useContext, useEffect, useState} from 'react';
import {Input, Tab, Tabs} from '@nextui-org/react';
import {LoadStatusContext} from '../loading/LoadStatusContext';
import TeamData from "@/types/TeamData";
import {AvgModal, BestModal} from "@/types/scoutingform";
import {Team} from "@/types/Team";
import {getMatch} from "@/components/fetches/apicalls";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import Justthedata from "@/components/data/justthedata";

const eventName = getCurrentEvent();

interface TeamList {
    red: string[],
    blue: string[]
}

const MemoizedJustthedata = React.memo(Justthedata);

export default function MatchData() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState<TeamData>();
    const [teamAverages, setTeamAverages] = useState<AvgModal>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [teamBest, setTeamBest] = useState<BestModal>()
    const [usersRequested, setUsersRequested] = useState<boolean>(false);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<{ name: string; uuid: string; email: string }[]>([]);
    const [teamInfo, setTeamInfo] = useState<Team>();
    const [matchNumber, setMatchNumber] = useState(0);
    const [match, setMatch] = useState<any>();
    const [teamList, setTeamList] = useState<TeamList>();

    const loadGame = async () => {
        try {
            setValue(0);
            setLoading(true);
            const matchID = `${eventName}_qm${matchNumber}`;
            const data = await getMatch(matchID)
            console.log(data);
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
                    placeholder="Enter team number"
                />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : errored ? (
                <p>No data available. Please enter a valid match number.</p>
            ) : match ? (
                <>
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
                </>
            ) : (
                <p>No data available. Please enter a valid match number.</p>
            )}
        </>
    );
}