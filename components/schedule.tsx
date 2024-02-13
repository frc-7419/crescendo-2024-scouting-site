'use client';

import { Match } from '@/types/match';
import { Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Spinner, Chip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';


const MatchSchedule = ({ matches, loading, time }: { matches: Match[], loading: any, time: Date }) => {
    const [eventKey, seteventKey] = useState('2023casf');

    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

    useEffect(() => {
        const filtered = matches.filter((match: Match) => new Date(match.predicted_time * 1000) >= time);
        setFilteredMatches(filtered);
    }, [matches, time]);


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
                                <TableColumn key="match_number">Match</TableColumn>
                                <TableColumn key="predicted_time">Time</TableColumn>
                                <TableColumn key="alliances.blue">Blue Alliance</TableColumn>
                                <TableColumn key="alliances.red">Red Alliance</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={filteredMatches}
                                loadingContent={<Spinner label="Loading..." />}
                            >
                                {(item) => (
                                    <TableRow key={item.key}>
                                        <TableCell>
                                            {
                                                item.comp_level === 'qm' ?
                                                    `Qual ${item.match_number}` :
                                                    item.comp_level === 'sf' ?
                                                        `Semi-Finals ${item.set_number}` :
                                                        `Finals ${item.match_number}`
                                            }</TableCell>
                                        <TableCell>{new Date(item.predicted_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>
                                            <div className='flex flex-row justify-between'>
                                                {item.alliances.blue.team_keys.map((teamKey) => (
                                                    <div className='w-28 text-center' key={teamKey}>
                                                        <Chip color="primary">
                                                            {teamKey.replace("frc", "")}
                                                        </Chip>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex flex-row justify-between'>
                                                {item.alliances.red.team_keys.map((teamKey) => (
                                                    <div className='w-28 text-center' key={teamKey}>
                                                        <Chip color="danger">
                                                            {teamKey.replace("frc", "")}
                                                        </Chip>
                                                    </div>
                                                ))}
                                            </div>
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

export default MatchSchedule;