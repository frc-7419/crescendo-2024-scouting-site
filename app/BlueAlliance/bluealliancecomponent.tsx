"use client";

import React, { useEffect, useState } from 'react';
import { Team } from '@/types/Team';
const BlueAllianceComponent = () => {
    const [teamKey, setTeamKey] = useState('frc254');
    const [data, setData] = useState<Team>({} as Team);

    useEffect(() => {
        if (teamKey) {
            fetch(`https://www.thebluealliance.com/api/v3/team/${teamKey}`, {
                headers: new Headers({
                    'X-TBA-Auth-Key': process.env.BLUEALLIANCE_API_KEY || ''
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.debug(data);
                    setData(data);
                })
                .catch(error => console.error(error));
        }
    }, [teamKey]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamKey(event.target.value);
    };

    return (
        <div>
            <input type="text" value={teamKey} onChange={handleInputChange} placeholder="Enter team key" />
            {data ? (
                <div>
                    <h1>{data.nickname}</h1>
                    <p>Team Number: {data.team_number}</p>
                    <p>City: {data.city}</p>
                    <p>Country: {data.country}</p>
                    <p><a href={data.website}>Website</a></p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
export default BlueAllianceComponent;