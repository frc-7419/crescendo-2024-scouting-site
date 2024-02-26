'use client';

import { Match } from '@/types/match';
import { Scouter } from '@/types/schedule';
import { faCog, faDoorOpen, faMailForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Spinner, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem } from '@nextui-org/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getCurrentEvent } from '@/components/getCurrentEvent';


const ScouterSchedule = ({ matches, loading, time, shifts }: { matches: Match[], loading: any, time: Date, shifts: Scouter[] }) => {
    const eventKey = getCurrentEvent();

    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

    useEffect(() => {
        const filtered = matches.filter((match: Match) => (new Date(match.predicted_time * 1000) >= time) && shifts.some((shift) => shift.ScoutingSchedule?.matchID === match.key));
        setFilteredMatches(filtered);
    }, [matches, time, shifts]);


    const PopButton = ({ icon, text }: { icon: JSX.Element, text: string }) => {
        return (
            <div className='flex justify-between items-center gap-4'>
                <div className="">
                    {text}
                </div>
                <div className="">
                    {icon}
                </div>
            </div>
        )
    }

    const getScoutedTeam = (match: Match) => {
        const shift = shifts.find((shift) => shift.ScoutingSchedule?.matchID === match.key);
        let team;
        let alliance;
        if (shift) {
            console.debug(shift.role)
            switch (shift.role as string) {
                case "BLUEONE":
                    team = match.alliances.blue.team_keys[0];
                    alliance = "Blue Alliance";
                    break;
                case "BLUETWO":
                    team = match.alliances.blue.team_keys[1];
                    alliance = "Blue Alliance";
                    break;
                case "BLUETHREE":
                    team = match.alliances.blue.team_keys[2];
                    alliance = "Blue Alliance";
                    break;
                case "REDONE":
                    team = match.alliances.red.team_keys[0];
                    alliance = "Red Alliance";
                    break;
                case "REDTWO":
                    team = match.alliances.red.team_keys[1];
                    alliance = "Red Alliance";
                    break;
                case "REDTHREE":
                    team = match.alliances.red.team_keys[2];
                    alliance = "Red Alliance";
                    break;
            }
        }
        const scoutedTeam = {
            team: team?.replace("frc", ""),
            alliance: alliance
        };

        console.debug(scoutedTeam)
        return scoutedTeam

    }
    return (
        <div className='max-w-full'>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {filteredMatches.length === 0 ? (
                        <p>No upcoming matches</p>
                    ) : (
                        <Table hideHeader>
                            <TableHeader>
                                <TableColumn key="predicted_time">Time</TableColumn>
                                <TableColumn key="match_number">Match</TableColumn>
                                <TableColumn key="message">Message</TableColumn>
                                <TableColumn key="form">Form</TableColumn>
                                <TableColumn key="settings">Settings</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={filteredMatches}
                                loadingContent={<Spinner label="Loading..." />}
                            >
                                {(item) => (
                                    <TableRow key={item.key} >
                                        <TableCell >
                                            <div className='flex flex-row items-center gap-4'>
                                                <div className={`${(getScoutedTeam(item).alliance == "Blue Alliance") ? 'bg-blue-600' : 'bg-red-600'} w-3 h-3`}></div>
                                                {new Date(item.predicted_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </TableCell>
                                        <TableCell >
                                            {
                                                item.comp_level === 'qm' ?
                                                    `Qual ${item.match_number}` :
                                                    item.comp_level === 'sf' ?
                                                        `Semi-Finals ${item.set_number}` :
                                                        `Finals ${item.match_number}`
                                            }
                                        </TableCell>
                                        <TableCell id="yourscouting">
                                            <div className='flex-grow'>
                                                {getScoutedTeam(item) && (
                                                    <span >You are scouting {getScoutedTeam(item).team} on the {getScoutedTeam(item).alliance}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {/* waiting for form component */}
                                            <Link href={`/scouting/${item.key}`} className='text-center'>Open Form</Link>
                                        </TableCell>
                                        <TableCell>
                                            <Popover showArrow>
                                                <PopoverTrigger>
                                                    <button>
                                                        <FontAwesomeIcon className='hover:animate-spin' icon={faCog} />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="text-xl">
                                                    <Listbox
                                                        aria-label="Actions"
                                                    >
                                                        <ListboxItem key="settings">
                                                            <PopButton
                                                                icon={<FontAwesomeIcon icon={faMailForward} />}
                                                                text="Dispute"
                                                            />
                                                        </ListboxItem>
                                                        <ListboxItem key="logout" className="text-danger" color="danger">
                                                            <PopButton
                                                                icon={<FontAwesomeIcon icon={faDoorOpen} />}
                                                                text="Logout"
                                                            />
                                                        </ListboxItem>
                                                    </Listbox>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </>
            )}
        </div>
    );
};

export default ScouterSchedule;