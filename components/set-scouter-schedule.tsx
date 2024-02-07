'use client';

import { Match } from '@/types/Match';
import { Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Spinner, Chip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';


const SetScouterSchedule = ({ matches, loading, time }: { matches: Match[], loading: any, time: Date }) => {
    const [eventKey, seteventKey] = useState('2023casf');


    return (
        <div className='max-w-full'>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {matches.length === 0 ? (
                        <p>Schedule Pending</p>
                    ) : (
                        <Table hideHeader>
                            <TableHeader>
                                <TableColumn key="match_number">Match</TableColumn>
                                <TableColumn key="predicted_time">Time</TableColumn>
                                <TableColumn key="alliances.blue">Blue Alliance</TableColumn>
                                <TableColumn key="alliances.red">Red Alliance</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={matches}
                                loadingContent={<Spinner label="Loading..." />}
                            >
                                {(item) => (
                                    <TableRow key={item.key}>
                                        <TableCell>Qual {item.match_number}</TableCell>
                                        <TableCell>{new Date(item.predicted_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>
                                            <div className='flex flex-row justify-between'>
                                                {item.alliances.blue.team_keys.map((teamKey) => (
                                                    <div className='w-28 text-center'>
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
                                                    <div className='w-28 text-center'>
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

export default SetScouterSchedule;