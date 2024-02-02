"use client";

import React, { useEffect, useState } from 'react';

const BlueAllianceComponent = () => {
    const [teamKey, setTeamKey] = useState('frc254'); 
    const [data, setData] = useState(null);

    useEffect(() => {
        if (teamKey) {
            fetch(`https://www.thebluealliance.com/api/v3/team/${teamKey}`, {
                headers: {
                    'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
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