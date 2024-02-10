'use client';

import { Match } from '@/types/match';
import { Scouter, ScoutingSchedule } from '@/types/schedule';
import { Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Spinner, Chip, Input, Button, Selection, Avatar, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { TeamRole } from '@prisma/client';
import { match } from 'assert';
import React, { FormEvent, Key, createRef, use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { set } from 'zod';

const SetScouterSchedule = ({ matches, loading, time }: { matches: Match[], loading: any, time: Date }) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
    const [tableKey, setTableKey] = useState<string>('table');
    const [blueOneId, setBlueOne] = useState<Key>('');
    const [blueTwoId, setBlueTwo] = useState<Key>('');
    const [blueThreeId, setBlueThree] = useState<Key>('');
    const [redOneId, setRedOne] = useState<Key>('');
    const [redTwoId, setRedTwo] = useState<Key>('');
    const [redThreeId, setRedThree] = useState<Key>('');
    const ref = createRef<HTMLFormElement>();
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const roles = ['BLUEONE', 'BLUETWO', 'BLUETHREE', 'REDONE', 'REDTWO', 'REDTHREE'];
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [arrayInitliazed, setArrayInitialized] = useState<boolean>(false);
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
        try {
            const response = await fetch('/api/users/getusers');
            const data = await response.json();
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
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const redOne = formData.get('redOne') as string;
        const redTwo = formData.get('redTwo') as string;
        const redThree = formData.get('redThree') as string;
        const blueOne = formData.get('blueOne') as string;
        const blueTwo = formData.get('blueTwo') as string;
        const blueThree = formData.get('blueThree') as string;
        const keys = Array.from(selectedKeys);

        const updatedMatches = playerMatches.map((match) => {
            if (keys.includes(match.key)) {
                match.alliances.blue.scouters = [blueOne, blueTwo, blueThree];
                match.alliances.blue.scoutersIDs = [blueOneId?.toString() ?? '', blueTwoId?.toString() ?? '', blueThreeId?.toString() ?? ''];
                match.alliances.red.scouters = [redOne, redTwo, redThree];
                match.alliances.red.scoutersIDs = [redOneId?.toString() ?? '', redTwoId?.toString() ?? '', redThreeId?.toString() ?? ''];
            }

            return match;
        });

        updateMatches(updatedMatches);
    };

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
        if (playerMatches.length < 1) return;
        if (dataLoaded) return;
        console.debug("hi")
        setUsersLoading(true);
        try {
            const response = await fetch(`/api/schedule/get?venue=${matches[0].event_key}`)
            const data = await response.json();
            const entryArray = Object.entries(data.entries) as [string, { matchID: string; scouters: any }][];
            entryArray.forEach((entry: [string, { matchID: string; scouters: any }]) => {
                console.debug(entry)
                editColumn(entry[1].matchID, entry[1].scouters)
            });
            setDataLoaded(true);

        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
        setUsersLoading(false);
        console.debug(playerMatches, "playerMatches")
    };

    useEffect(() => {
        loadData();
    }, [playerMatches, arrayInitliazed]);

    const handleClear = () => {
        const keys = Array.from(selectedKeys)

        const updatedMatches = playerMatches.map((match) => {
            if (keys.includes(match.key)) {
                match.alliances.blue.scouters = [];
                match.alliances.red.scouters = [];
            }
            return match;
        });


        updateMatches(updatedMatches);
    };

    const uploadSchedule = () => {
        setSubmitting(true);
        console.debug("Starting Submit")
        let scoutingschedule: { [matchID: string]: ScoutingSchedule } = {};

        playerMatches.forEach((match) => {
            if (match.alliances.blue.scouters.length > 0) {
                const blueScouters: Scouter[] = match.alliances.blue.scoutersIDs.map((scouter, index) => {
                    return {
                        scouterId: scouter,
                        role: roles[index] as TeamRole,
                    };
                });

                const redScouters: Scouter[] = match.alliances.red.scoutersIDs.map((scouter, index) => {
                    return {
                        scouterId: scouter,
                        role: roles[index + 3] as TeamRole,
                    };
                });

                const entry: ScoutingSchedule = {
                    matchNumber: match.match_number,
                    matchID: match.key,
                    venue: match.event_key,
                    scouters: [...blueScouters, ...redScouters],
                };

                scoutingschedule[match.key] = entry;
            }
        });

        console.debug(scoutingschedule, matches[0].event_key);

        const scheduleData = {
            venue: matches[0].event_key,
            entries: scoutingschedule
        }

        fetch('/api/schedule/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
        })
            .then((response) => {
                if (response.ok) {
                    toast.success('Schedule Updated');
                } else {
                    toast.error('Error Updating Schedule');
                }
                setSubmitting(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setSubmitting(false);
            });
    };

    useEffect(() => {
        setTableKey(Math.random().toString());
    }, [playerMatches]);

    useEffect(() => {
        const updatedMatches = matches.map((match) => {
            match.alliances.blue.scouters = [];
            match.alliances.blue.scoutersIDs = [];
            match.alliances.red.scouters = [];
            match.alliances.red.scoutersIDs = [];
            return match;
        });
        setPlayerMatches(updatedMatches)
        setArrayInitialized(true)
    }, [matches]);

    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <div className='max-w-full'>
                <form ref={ref} className="flex flex-col p-2 rounded-xl gap-4" onSubmit={handleSubmit}>
                    <div className='align-right flex gap-4 flex-row w-full'>
                        <h1 className="text-2xl font-semibold flex-grow">Scouting Schedule</h1>
                        <Button variant="bordered" color='primary' type="submit" isDisabled={submitting} isLoading={usersLoading}>
                            Submit
                        </Button>
                        <Button variant="bordered" color='warning' onClick={() => ref.current?.reset()} isDisabled={submitting} isLoading={usersLoading}>
                            Clear
                        </Button>
                        <Button variant="bordered" onClick={handleClear} color='danger' isDisabled={submitting} isLoading={usersLoading}>
                            Delete
                        </Button>
                        <Button variant="bordered" color='secondary' onClick={uploadSchedule} isLoading={submitting || usersLoading}>
                            Push Changes
                        </Button>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <Autocomplete
                            isRequired
                            label="Blue One"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="blueOne"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setBlueOne}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Autocomplete
                            isRequired
                            label="Blue Two"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="blueTwo"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setBlueTwo}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Autocomplete
                            isRequired
                            label="Blue Three"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="blueThree"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setBlueThree}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Autocomplete
                            isRequired
                            label="Red One"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="redOne"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setRedOne}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Autocomplete
                            isRequired
                            label="Red Two"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="redTwo"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setRedTwo}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Autocomplete
                            isRequired
                            label="Red Three"
                            defaultItems={users}
                            isLoading={usersLoading}
                            name="redThree"
                            placeholder="User"
                            type="text"
                            onSelectionChange={setRedThree}
                        >
                            {(user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                    </div>
                </form>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {playerMatches.length === 0 ? (
                            <p>Schedule Pending</p>
                        ) : (
                            <Table
                                hideHeader
                                selectionMode="multiple"
                                selectionBehavior="replace"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
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
                                    loadingContent={<Spinner label="Loading..." />}
                                >
                                    {(item) => (
                                        <TableRow key={item.key}>
                                            <TableCell>Qual {item.match_number}</TableCell>
                                            <TableCell>{new Date(item.predicted_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
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
            </div >
        </div>
    );
};

export default SetScouterSchedule;