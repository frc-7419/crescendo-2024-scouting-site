'use client';

import {Match} from '@/types/match';
import {Scouter} from '@/types/schedule';
import {
    Avatar,
    Chip,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';
import React, {useContext, useEffect, useState} from 'react';
import {LoadStatusContext} from './LoadStatusContext';
import axios from 'axios';


const AdminMatchSchedule = ({matches, loading, time}: { matches: Match[], loading: any, time: Date }) => {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
    const [tableKey, setTableKey] = useState<string>('table');

    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const roles = ['BLUEONE', 'BLUETWO', 'BLUETHREE', 'REDONE', 'REDTWO', 'REDTHREE'];
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [arrayInitliazed, setArrayInitialized] = useState<boolean>(false);
    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
    const [requested, setRequested] = useState<boolean>(false);
    const [usersRequested, setUsersRequested] = useState<boolean>(false);

    const getUser = (uuid: string) => {
        return users.find((user) => user.uuid === uuid);
    };

    const [users, setUsers] = useState<{ name: string; uuid: string }[]>([]);

    const abbreviate_name = (name: string) => {
        const words = name.split(' ');
        let first_name = words[0];
        let last_name = '';
        last_name = words[words.length - 1];

        if (first_name.length > 6) {
            first_name = first_name.slice(0, 6) + '.';
            last_name = '';
        }

        const abbreviation = first_name + (last_name.length > 1 ? ` ${last_name[0].toUpperCase()}.` : '');
        return abbreviation;
    }

    const updateMatches = (updatedMatches: Match[]) => {
        setPlayerMatches((prevMatches) => {
            return prevMatches.map((match) => {
                const updatedMatch = updatedMatches.find(
                    (updatedMatch) => updatedMatch.key === match.key
                );
                return updatedMatch ? updatedMatch : match;
            });
        });
    };

    const fetchUsers = async () => {
        if (users.length > 0) return;
        if (usersRequested) return;
        setUsersRequested(true);
        try {
            const response = await axios.get('/api/users/getusers', {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                }
            });
            const data = await response.data;
            const users = data.map((user: { name: string, id: string }) => ({
                name: user.name,
                uuid: user.id
            }));
            // Store the fetched users
            setUsers(users);
            setUsersLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setUsersRequested(false);
    };

    useEffect(() => {
        fetchUsers();
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const editColumn = (matchId: string, scouters: []) => {
        const updatedMatches = playerMatches.map((match) => {
            if (match.key === matchId) {
                match.alliances.blue.scoutersIDs = [];
                match.alliances.red.scoutersIDs = [];
                scouters.forEach((scouter: Scouter, index) => {
                    console.debug(scouter)
                    if (scouter.role.includes('BLUE')) {
                        match.alliances.blue.scoutersIDs.push(scouter.scouterId);
                        const user = getUser(scouter.scouterId);
                        if (user) {
                            match.alliances.blue.scouters.push(user.name);
                        }
                    } else {
                        match.alliances.red.scoutersIDs.push(scouter.scouterId);
                        const user = getUser(scouter.scouterId);
                        if (user) {
                            match.alliances.red.scouters.push(user.name);
                        }
                    }
                })
            }
            return match;
        });

        updateMatches(updatedMatches);
    };


    const loadData = async () => {
        console.debug(requested, playerMatches.length, users.length, dataLoaded)
        if (requested) return;
        if (playerMatches.length < 1) return;
        if (users.length < 1) return;
        if (dataLoaded) return;
        setRequested(true);

        console.debug("hi")
        setUsersLoading(true);
        try {
            const response = await axios.get(`/api/schedule/get?venue=${matches[0].event_key}`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                }
            })
            const data = await response.data;
            const entryArray = Object.entries(data.entries) as [string, { matchID: string; scouters: any }][];
            entryArray.forEach((entry: [string, { matchID: string; scouters: any }]) => {
                editColumn(entry[1].matchID, entry[1].scouters)
            });
            setDataLoaded(true);

        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
        setUsersLoading(false);
        setRequested(false);
        console.debug(playerMatches, "playerMatches")
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, playerMatches]);

    useEffect(() => {
        setTableKey(Math.random().toString());
    }, [playerMatches]);

    useEffect(() => {
        const updatedMatches = filteredMatches.map((match) => {
            match.alliances.blue.scouters = [];
            match.alliances.blue.scoutersIDs = [];
            match.alliances.red.scouters = [];
            match.alliances.red.scoutersIDs = [];
            return match;
        });
        setPlayerMatches(updatedMatches)
        setArrayInitialized(true)
    }, [filteredMatches]);

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
                    {playerMatches.length === 0 ? (
                        <p>Schedule Pending</p>
                    ) : (
                        <Table
                            hideHeader
                            key={tableKey}
                        >
                            <TableHeader>
                                <TableColumn key="match_number">Match</TableColumn>
                                <TableColumn key="predicted_time">Time</TableColumn>
                                <TableColumn key="alliances_blue">Blue Alliance</TableColumn>
                                <TableColumn key="alliances_red">Red Alliance</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={playerMatches}
                                loadingContent={<Spinner label="Loading..."/>}
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
                                        <TableCell>{new Date(item.predicted_time * 1000).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</TableCell>
                                        <TableCell>
                                            <div className='flex flex-row justify-between'>
                                                {item.alliances.blue.team_keys.map((teamKey, index) => (
                                                    <div className='w-28 text-center flex flex-col gap-2' key={teamKey}>
                                                        {item.alliances.blue.scouters.length > 0 && (
                                                            <>
                                                                <Chip
                                                                    variant="flat"
                                                                    avatar={
                                                                        <Avatar
                                                                            name={item.alliances.blue.scouters[index]}
                                                                            src={`https://i.pravatar.cc/300?u=${item.alliances.blue.scouters[index]}`}
                                                                        />
                                                                    }
                                                                >
                                                                    {abbreviate_name(item.alliances.blue.scouters[index])}
                                                                </Chip>
                                                            </>
                                                        )}
                                                        <Chip color="primary">
                                                            {teamKey.replace("frc", "")}
                                                        </Chip>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex flex-row justify-between'>
                                                {item.alliances.red.team_keys.map((teamKey, index) => (
                                                    <div className='w-28 text-center flex flex-col gap-2' key={teamKey}>
                                                        {item.alliances.red.scouters.length > 0 && (
                                                            <>
                                                                <Chip
                                                                    variant="flat"
                                                                    avatar={
                                                                        <Avatar
                                                                            name={item.alliances.red.scouters[index]}
                                                                            src={`https://i.pravatar.cc/300?u=${item.alliances.red.scouters[index]}`}
                                                                        />
                                                                    }
                                                                >
                                                                    {abbreviate_name(item.alliances.red.scouters[index])}
                                                                </Chip>
                                                            </>
                                                        )}
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
            )
            }
        </div>
    );
};

export default AdminMatchSchedule;