'use client';

import { Match } from '@/types/Match';
import { Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Spinner, Chip, Input, Button, Selection, Avatar, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import React, { FormEvent, createRef, useEffect, useState } from 'react';


const SetScouterSchedule = ({ matches, loading, time }: { matches: Match[], loading: any, time: Date }) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
    const [tableKey, setTableKey] = useState<string>('table');

    const ref = createRef<HTMLFormElement>();

    const users = [
        {name: "Jahaanshah Sheikh", uuid: "jahaanshah"},
        {name: "James Zhang", uuid: "jamesz"},
        {name: "William Chen", uuid: "willchen"},
        {name: "Veerrohit Veeravadivel", uuid: "rohitv"},
        {name: "Adhyayan Singh", uuid: "adhyayan"},
        {name: "Win Htet Lin", uuid: "win"},
    ];

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const redOne = formData.get('redOne') as string;
        const redTwo = formData.get('redTwo') as string;
        const redThree = formData.get('redThree') as string;
        const blueOne = formData.get('blueOne') as string;
        const blueTwo = formData.get('blueTwo') as string;
        const blueThree = formData.get('blueThree') as string;
        const keys = Array.from(selectedKeys)

        const updatedMatches = playerMatches.map((match) => {
            if (keys.includes(match.key)) {
                match.alliances.blue.scouters = [blueOne, blueTwo, blueThree];
                match.alliances.red.scouters = [redOne, redTwo, redThree];
            }
            return match;
        });



        updateMatches(updatedMatches);
    };

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

    useEffect(() => {
        setTableKey(Math.random().toString());
    }, [playerMatches]);

    useEffect(() => {
        const updatedMatches = matches.map((match) => {
            match.alliances.blue.scouters = [];
            match.alliances.red.scouters = [];
            return match;
        });
        setPlayerMatches(updatedMatches)
    }, [matches]);

    useEffect(() => {
        console.log(playerMatches)
    }, [playerMatches]);

    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <div className='max-w-full'>
                <form ref={ref} className="flex flex-col p-2 rounded-xl gap-4" onSubmit={handleSubmit}>
                    <div className='align-right flex gap-4 flex-row w-full'>
                        <h1 className="text-2xl font-semibold flex-grow">Scouting Schedule</h1>
                        <Button variant="bordered" color='primary' type="submit">
                            Submit
                        </Button>
                        <Button variant="bordered" color='warning' onClick={() => ref.current?.reset()}>
                            Clear
                        </Button>
                        <Button variant="bordered" onClick={handleClear} color='danger'>
                            Delete
                        </Button>
                        <Button variant="bordered" color='secondary'>
                            Push Changes
                        </Button>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <Autocomplete
                            isRequired
                            label="Blue One"
                            name="blueOne"
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            isRequired
                            label="Blue Two"
                            name="blueTwo"
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            isRequired
                            label="Blue Three"
                            name="blueThree" 
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            isRequired
                            label="Red One"
                            name="redOne"
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            isRequired
                            label="Red Two"
                            name="redTwo"
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            isRequired
                            label="Red Three"
                            name="redThree" 
                            placeholder="User"
                            type="text"
                        >
                            {users.map((user) => (
                                <AutocompleteItem key={user.uuid} value={user.name}>
                                    {user.name}
                                </AutocompleteItem>
                            ))}
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
                                                                        {abbreviate_name(item.alliances.blue.scouters[index])}
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