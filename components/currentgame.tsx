import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const getCurrentMatch = (matches: any[], time: any) => {
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [noMatch, setNoMatch] = useState(false);

    useEffect(() => {
        if (matches && matches.length > 0) {
            const specificMatch = matches.find(
                (data) => time <= new Date(data.predicted_time * 1000)
            );

            if (specificMatch) {
                setMatch(specificMatch);
                setIsLoading(false);
                setNoMatch(false);
            } else {
                setError(`No match found at ${time}`);
                setIsLoading(false);
                setNoMatch(true)
            }
        }
    }, [matches, time]);

    return { match, isLoading, error, noMatch };
};

const CurrentGame = ({ eventName, loading, matches, time }: { eventName: string, loading: boolean, matches: any, time: Date }) => {
    const { match, isLoading, error, noMatch } = getCurrentMatch(matches, time);
    console.debug(error)
    if (loading || isLoading) {
        return (
            <div className="bg-slate-800 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
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
    } else if(noMatch){
        return (
            <div className="bg-slate-800 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <p className="qual text-xl font-semibold">Event Has Concluded</p>
                    <p className="nextShift text-2xl font-semibold align-bottom">No Upcoming Shifts</p>
                </div>
            </div >
        )
    }
    
    else {
        return (
            <div className="bg-slate-800 rounded-lg mt-6 mb-6 drop-shadow-lg shadow-inner flex flex-row">
                <div className='p-6 currentMatchCard'>
                    <h1 className="currentEvent text-2xl font-semibold event">{eventName}</h1>
                    <p className="qual text-xl font-semibold">{
                        match.comp_level === 'qm' ?
                            `Qual ${match.match_number}/90` :
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
                            match && match.alliances.blue.team_keys.map((teamKey) => (
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
                            match && match.alliances.red.team_keys.map((teamKey) => (
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