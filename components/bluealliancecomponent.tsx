'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import { Event } from '@/types/Event';
import { Team } from '@/types/Team';
import '@/app/globals.css';
import { Button, Card, CardBody, Input, Image, Accordion, AccordionItem, Spacer, Divider, Link } from '@nextui-org/react';
import { Select, SelectSection, SelectItem } from "@nextui-org/react";

const BlueAllianceComponent: React.FC = () => {
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState<Team | null>(null);
    const [teamEvents, setTeamEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<string>('2024');

    const getTeamInfo = () => {
        if (teamNumber && /^\d+$/.test(teamNumber)) {
            setLoading(true);
            const teamKey = `frc${teamNumber}`;
            fetch(`/api/bluealliance/getTeamInfo/${teamKey}?season=${selectedSeason}`)
                .then(response => response.json())
                .then(data => {
                    setTeamData(data.teamResponse);
                    setTeamEvents(data.eventsResponse);
                    setLoading(false);
                })
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value);
    };

    return (
        <>
            <div className='flex'>
                <Input
                    fullWidth
                    type="text"
                    value={teamNumber}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            getTeamInfo();
                        }
                    }}
                    placeholder="Enter team number"
                />
                <Select
                    label="Season"
                    placeholder="2024"
                    className="w-40"
                    onChange={handleSeasonChange}
                >
                    <SelectItem key={2023} value={2023}>
                        2023
                    </SelectItem>
                    <SelectItem key={2024} value={2024}>
                        2024
                    </SelectItem>
                </Select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : teamData ? (
                <><Card
                    isBlurred
                    className='mt-4'
                >
                    <CardBody>
                        <div className="">
                            <div className="flex flex-col">
                                <div className="flex justify-between align-middle">
                                    <div className='flex flex-col'>
                                        <p className="font-bold text-2xl">{teamData.team_number}: {teamData.nickname}</p>
                                        <p className='text-small font-medium'>{teamData.name}</p>
                                    </div>
                                    <Link href={`https://www.google.com/maps/search/?api=1&query=${teamData.city},${teamData.state_prov}`} className="text-medium font-medium">{teamData.city}, {teamData.state_prov}</Link>
                                </div>
                            </div>
                            <Divider className="my-4" />
                            <div>
                                {teamEvents.length > 0 ? (
                                    <div>
                                        <p className='text-xl'>Events in Season {selectedSeason}</p>
                                        <Accordion>
                                            {teamEvents.map(event => (
                                                <AccordionItem key={event.key} aria-label={event.name} title={event.name} subtitle={event.event_type_string}>
                                                    <div className="accordion-item-content">
                                                        <p>Week {event.week}</p>
                                                        <p>Event Code: {event.event_code}</p>
                                                        <p>{event.city}, {event.state_prov}</p>
                                                        <p>
                                                            <span>{event.start_date && event.end_date ? new Date(event.start_date).toLocaleDateString() + ' - ' + new Date(event.end_date).toLocaleDateString() : ''}</span>
                                                        </p>
                                                        <p>Address: {event.address}</p>
                                                        <Link href={event.gmaps_url}>Open In Google Maps</Link>
                                                        <p>Website: <Link>{event.website}</Link></p>
                                                    </div>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ) : (
                                    <p>No events available for this team in {selectedSeason}.</p>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card></>
            ) : (
                <p>No data available. Please enter a valid team number.</p>
            )}
        </>
    );
}

export default BlueAllianceComponent;
