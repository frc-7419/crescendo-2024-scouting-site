'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import { Event } from '@/types/Event';
import { Team } from '@/types/Team';
import '@/app/globals.css';
import styles from './BlueAllianceComponent.module.css'; 

const BlueAllianceComponent: React.FC = () => {
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState<Team | null>(null);
    const [teamEvents, setTeamEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<string>('2024'); 

    useEffect(() => {
        if (teamNumber && /^\d+$/.test(teamNumber)) {
            setLoading(true);
            const teamKey = `frc${teamNumber}`;
            fetch(`https://www.thebluealliance.com/api/v3/team/${teamKey}`, {
                headers: new Headers({
                    'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
                })
            })
            .then(response => response.json())
            .then(teamResponse => {
                console.log('Team Data:', teamResponse);
                setTeamData(teamResponse);
                return fetch(`https://www.thebluealliance.com/api/v3/team/${teamKey}/events/${selectedSeason}`, {
                    headers: new Headers({
                        'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
                    })
                });
            })
            .then(response => response.json())
            .then(eventsResponse => {
                console.log('Team Events:', eventsResponse);
                setTeamEvents(eventsResponse);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                setLoading(false);
            });
        }
    }, [teamNumber, selectedSeason]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value);
    };

    return (
        <main className="h-screen overflow-clip dark:bg-slate-950">
        <SideBar />
        <NavBar /><div className={styles.blueAllianceContainer}>
            <input
                type="text"
                value={teamNumber}
                onChange={handleInputChange}
                placeholder="Enter team number" />
            <select value={selectedSeason} onChange={handleSeasonChange}>
                <option value="2024">2024</option>
                {/* Add more options for other seasons */}
            </select>
            {loading ? (
                <p>Loading...</p>
            ) : teamData ? (
                <div>
                    <h1>{teamData.nickname}</h1>
                    <p>Team Number: {teamData.team_number}</p>
                    <p>City: {teamData.city}</p>
                    <p>Country: {teamData.country}</p>
                    <p>
                        <a href={teamData.website}>Website</a>
                    </p>
                    {teamEvents.length > 0 ? (
                        <div>
                            <h2>Events in Season {selectedSeason}</h2>
                            <ul>
                                {teamEvents.map(event => (
                                    <li key={event.key}>
                                        <p>Event Name: {event.name}</p>
                                        <p>Event Type: {event.event_type_string}</p>
                                        {/* <p>Location: {event.city}, {event.country}</p> */}
                                        {/* Display more information about the event */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No events available for this team in {selectedSeason}.</p>
                    )}
                </div>
            ) : (
                <p>No data available. Please enter a valid team number.</p>
            )}
        </div></>
        </main>   );
}

export default BlueAllianceComponent;
