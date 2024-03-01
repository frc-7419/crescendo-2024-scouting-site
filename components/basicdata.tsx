'use client';

import React, {useContext, useState} from 'react';
import '@/app/globals.css';
import {Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {getRobotAverages, getRobotData} from "@/components/fetches/apicalls";
import TeamData from "@/types/TeamData";
import {Averages} from "@prisma/client";

export default function BasicData() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState<TeamData>();
    const [teamAverages, setTeamAverages] = useState<Averages>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    const getTeamInfo = async () => {
        if (teamNumber) {
            setValue(0);
            setErrored(false);
            setLoading(true);
            setTeamData(undefined);
            setTeamAverages(undefined);
            try {
                setTeamData(await getRobotData(teamNumber))
                setValue(50)
                setTeamAverages(await getRobotAverages(teamNumber))
                setValue(100)
                setLoading(false);
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
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : errored ? (
                <p>No data available. Please enter a valid team number.</p>
            ) : teamData ? (
                <>
                    <div>
                        <p className={'p-2 text-lg'}>Averages:</p>
                        <Table
                            key={teamAverages?.id}
                        >
                            <TableHeader>
                                <TableColumn key="avgampauton">Auton Amp</TableColumn>
                                <TableColumn key="avgspeakerauton">Auton Speaker</TableColumn>
                                <TableColumn key="avgampteleop">Teleop Amp</TableColumn>
                                <TableColumn key="avgspeakerteleop">Teleop Speaker</TableColumn>
                                <TableColumn key="avgtimesamped">Times Amped</TableColumn>
                                <TableColumn key="avgtrap">Trap</TableColumn>
                                <TableColumn key="avgdefense">Misc Defense</TableColumn>
                                <TableColumn key="avgreliability">Misc Reliablity</TableColumn>
                            </TableHeader>

                            <TableBody>
                                <TableRow key={teamAverages?.id}>
                                    <TableCell>
                                        {
                                            teamAverages?.avgampauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgspeakerauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgampteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgspeakerteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgtimesamped
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgtrap
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgdefense
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.avgreliability
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </div>

                    <p className={'p-2 text-lg'}>Data:</p>
                    <Table
                        key={teamData.id}
                    >
                        <TableHeader>
                            <TableColumn key="matchNumber">Match Number</TableColumn>
                            <TableColumn key="autonPreload">Auton Preload</TableColumn>
                            <TableColumn key="autonLeftCommunity">Auton Left Community</TableColumn>
                            <TableColumn key="autonSpeaker">Auton Speaker</TableColumn>
                            <TableColumn key="autonAmp">Auton Amp</TableColumn>
                            <TableColumn key="teleopDefensive">Teleop Defensive</TableColumn>
                            <TableColumn key="teleopAmp">Teleop Amp</TableColumn>
                            <TableColumn key="teleopSpeaker">Teleop Speaker</TableColumn>
                            <TableColumn key="teleopTimesAmped">Teleop Times Amped</TableColumn>
                            <TableColumn key="teleopPickupFrom">Teleop Pickup From</TableColumn>
                            <TableColumn key="teleopIsHanging">Teleop Is Hanging</TableColumn>
                            <TableColumn key="teleopTrap">Teleop Trap</TableColumn>
                            <TableColumn key="teleopSpotLight">Teleop Spotlit</TableColumn>
                            <TableColumn key="miscDefense">Misc Defense</TableColumn>
                            <TableColumn key="miscReliability">Misc Reliability</TableColumn>
                        </TableHeader>

                        <TableBody
                            items={teamData.scoutingData}
                            loadingContent={<Spinner label="Loading..."/>}
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {
                                            item.matchNumber
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(item.auton.preload)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(item.auton.leftCommunity)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.auton.speaker
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.auton.amp
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(item.teleop.defensive)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.amp
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.speaker
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.timesAmped
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.pickupFrom
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(item.teleop.isHanging)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.trap
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teleop.finalStatus
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.misc.defense
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.misc.reliability
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </>
            ) : (
                <p>No data available. Please enter a valid team number.</p>
            )}
        </>
    );
}