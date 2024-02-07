import { Match } from '@/types/Match';
import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const getCurrentMatch = (matches: any[], time: any) => {
    const [match, setMatch] = useState<Match>({} as Match);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (matches && matches.length > 0) {
            const specificMatch = matches.find(
                (data) => time <= new Date(data.predicted_time * 1000)
            );

            if (specificMatch) {
                setMatch(specificMatch);
                setError('');
                setIsLoading(false);
            } else {
                setError(`NM00`);
                setIsLoading(false);
            }
        } else {
            setError(`NM01`);
            setIsLoading(false);
        }
    }, [matches, time]);

    return { match, isLoading, error };
};

const CurrentGame = ({ eventName, loading, matches, time }: { eventName: string, loading: boolean, matches: any, time: Date }) => {
    const { match, isLoading, error } = getCurrentMatch(loading ? [] : matches, time);
    console.debug(error)

    const [qmMatchCount, setQmMatchCount] = useState(0);

    useEffect(() => {    
        const qmMatches = matches.filter((match: Match) => match.comp_level === 'qm');
        setQmMatchCount(qmMatches.length);
    }, [matches]);
    
    if (loading || isLoading) {
        return (
            <div className="dark:bg-slate-800 bg-slate-200 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <div className="qual text-xl font-semibold">Qual <Spinner color="default" /></div>
                    <div className="nextShift text-2xl font-semibold align-bottom">Your next shift is <Spinner color="default" /></div>
                </div>
                <div className='allianceView flex flex-col justify-between flex-grow mr-6'>
                    <div className="blueAllianceView bg-blue-600/60 h-20 rounded-b-lg items-center">
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                    </div>
                    <div className="redAllianceView bg-red-600/60 h-20 rounded-t-lg items-center">
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                        <div className="flex-grow text-center"><Spinner color="default" /></div>
                    </div>

                </div>
            </div>
        )
    } else if(error === "NM00"){
        return (
            <div className="dark:bg-slate-800 bg-slate-200 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <p className="qual text-xl font-semibold">Event Has Concluded</p>
                    <p className="nextShift text-2xl font-semibold align-bottom">No Upcoming Shifts</p>
                </div>
            </div >
        )
    } else if(error === "NM01"){
        return (
            <div className="dark:bg-slate-800 bg-slate-200 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <p className="qual text-xl font-semibold">Schedule Pending</p>
                    <p className="nextShift text-2xl font-semibold align-bottom">No Upcoming Shifts</p>
                </div>
            </div >
        )
    }
    
    else {
        return (
            <div className="dark:bg-slate-800 bg-slate-200 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <p className="qual text-xl font-semibold">{
                        match.comp_level === 'qm' ?
                            `Qual ${match.match_number}/${qmMatchCount}` :
                            match.comp_level === 'sf' ?
                                `Semi-Finals ${match.set_number}` :
                                `Finals ${match.match_number}`
                    }</p>
                    <p className="nextShift text-2xl font-semibold align-bottom">Your next shift is Qual 69</p>
                </div>
                <div className='allianceView flex flex-col justify-between flex-grow mr-6'>
                    <div className="blueAllianceView bg-blue-600/60 h-20 rounded-b-lg items-center">
                        {isLoading ? (
                            <>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                            </>
                        ) : (
                            match && match.alliances.blue.team_keys.map((teamKey: string) => (
                                <div className="flex-grow text-center text-2xl">{teamKey.replace("frc", "")}</div>
                            ))
                        )}
                    </div>
                    <div className="redAllianceView bg-red-600/60 h-20 rounded-t-lg items-center">
                        {isLoading ? (
                            <>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                                <div className="flex-grow text-center"><Spinner color="default" /></div>
                            </>
                        ) : (
                            match && match.alliances.red.team_keys.map((teamKey: string) => (
                                <div className="flex-grow text-center text-2xl">{teamKey.replace("frc", "")}</div>
                            ))
                        )}
                    </div>

                </div>
            </div >
        )
    }
}

export default CurrentGame;
