'use client';

import React, {useContext, useEffect, useState} from 'react';
import {Event} from '@/types/Event';
import {Team} from '@/types/Team';
import '@/app/globals.css';
import {Accordion, AccordionItem, Card, CardBody, Divider, Input, Link, Select, SelectItem} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {getTeamBlueAllianceData} from "@/components/fetches/apicalls";

export default function Teamlookupcomponent() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamInfo, setTeamInfo] = useState<Team | null>(null);
    const [teamEvents, setTeamEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<string>('2024');


    const getTeamInfo = () => {
        if (teamNumber && /^\d+$/.test(teamNumber)) {
            setErrored(false);
            setLoading(true);
            const teamKey = `frc${teamNumber}`;
            try {
                setValue(0);
                getTeamBlueAllianceData(teamKey, selectedSeason)
                    .then(data => {
                        setTeamInfo(data.teamResponse);
                        setTeamEvents(data.eventsResponse);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                        setErrored(true);
                        setLoading(false);
                    });
                setValue(100)
            } catch (error) {
                console.error(error);
                setErrored(true);
                setLoading(false);
                setValue(500);
            }
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value);
    };

    useEffect(() => {
        setValue(100);
    }, []);
    return (
        <>
            <div className='flex'>
                <Input
                    fullWidth
                    autoComplete='off'
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
            ) : errored ? (
                <p>No data available. Please enter a valid team number.</p>
            ) : teamInfo ? (
                <><Card
                    isBlurred
                    className='mt-4'
                >
                    <CardBody>
                        <div className="">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between align-middle">
                                    <div className='flex flex-col'>
                                        <p className="font-bold text-2xl">{teamInfo.team_number}: {teamInfo.nickname}</p>
                                        <p className='text-small font-medium'>{teamInfo.name}</p>
                                    </div>
                                    <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${teamInfo.city},${teamInfo.state_prov} ${teamInfo.school_name}`}
                                        className="text-medium font-medium">{teamInfo.city}, {teamInfo.state_prov}</Link>
                                </div>
                                <div className="flex h-5 items-center space-x-2">
                                    <p>Since {teamInfo.rookie_year}</p>
                                    {teamInfo.website && (
                                        <>
                                            <Divider orientation="vertical"/>
                                            <p>Website: <Link href={teamInfo.website}>{teamInfo.website}</Link></p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Divider className="my-4"/>
                            <div>
                                {teamEvents.length > 0 ? (
                                    <div>
                                        <p className='text-xl'>Events in Season {selectedSeason}</p>
                                        <Accordion>
                                            {teamEvents.map(event => (
                                                <AccordionItem key={event.key} aria-label={event.name}
                                                               title={event.name}
                                                               subtitle={`${event.event_type_string !== 'Offseason' && event.week !== undefined && event.week !== null ? `Week ${event.week + 1}` : ''}`}
                                                >
                                                    <div className="accordion-item-content">
                                                        <p></p>
                                                        <p>Event Code: {event.event_code}</p>
                                                        <p>{event.city}, {event.state_prov}</p>
                                                        <p>
                                                            <span>{event.start_date && event.end_date ? new Date(event.start_date).toLocaleDateString() + ' - ' + new Date(event.end_date).toLocaleDateString() : ''}</span>
                                                        </p>
                                                        {event.address && <p>Address: {event.address}</p>}
                                                        {event.gmaps_url &&
                                                            <Link href={event.gmaps_url}>Open In Google Maps</Link>}
                                                        {event.website && <p>Website: <Link
                                                            href={event.website}>{event.website}</Link></p>}
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
