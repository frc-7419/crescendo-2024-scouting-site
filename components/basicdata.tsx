'use client';

import React, {useContext, useEffect, useState} from 'react';
import {Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {getAverages, getRobotAverages, getRobotBest, getRobotData, getUsers} from "@/components/fetches/apicalls";
import TeamData from "@/types/TeamData";
import {getCurrentEvent} from "@/components/getCurrentEvent";
import {AvgModal, BestModal} from "@/types/scoutingform";

export default function BasicData() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState<TeamData>();
    const [teamAverages, setTeamAverages] = useState<AvgModal>();
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [allAverages, setAllAverages] = useState<AvgModal[]>([]);
    const [averagesLoaded, setAveragesLoaded] = useState(false)
    const [teamBest, setTeamBest] = useState<BestModal>()
    const [usersRequested, setUsersRequested] = useState<boolean>(false);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<{ name: string; uuid: string; email: string }[]>([]);

    const getUser = (uuid: string) => {
        return users.find((user) => user.uuid === uuid);
    };

    const fetchUsers = async () => {
        setValue(0)
        if (users.length > 0) return;
        if (usersRequested) return;
        setUsersRequested(true);
        try {
            const fetchedUsers = await getUsers()
            setUsers(fetchedUsers)
            setUsersLoading(false)
            setValue(100)
        } catch (error) {
            console.error('Error fetching users:', error);
            setValue(500)
        }
        setUsersRequested(false);
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTeamInfo = async () => {
        if (teamNumber) {
            setValue(0);
            setErrored(false);
            setLoading(true);
            setTeamData(undefined);
            setTeamAverages(undefined);
            try {
                setTeamData(await getRobotData(teamNumber))
                setValue(25)
                setTeamAverages(await getRobotAverages(teamNumber))
                setValue(50)
                setTeamBest(await getRobotBest(teamNumber))
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

    const fetchAllAverages = async () => {
        if (averagesLoaded) return;
        try {
            const averages = await getAverages(getCurrentEvent())
            setAllAverages(averages);
            setAveragesLoaded(true)
            setValue(100);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setValue(500);
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    useEffect(() => {
        fetchAllAverages()
    }, []);

    return (
        <>
            <p className={'p-2 text-lg'}>Leaderboard by Overall Performance:</p>
            <div className={'max-h-96 mb-4'}>
                {allAverages.length != 0 && (
                    <Table
                        key={"allAverages"}
                        isHeaderSticky
                        className={'max-h-96'}
                    >
                        <TableHeader>
                            <TableColumn key="rank">#</TableColumn>
                            <TableColumn key="team">Team</TableColumn>
                            <TableColumn key="intake">Intake</TableColumn>
                            <TableColumn key="avgampauton">Avg Auton Amp</TableColumn>
                            <TableColumn key="avgspeakerauton">Avg Auton Speaker</TableColumn>
                            <TableColumn key="avgampteleop">Avg Teleop Amp</TableColumn>
                            <TableColumn key="avgspeakerteleop">Avg Teleop Speaker</TableColumn>
                            <TableColumn key="avgcycletime">Avg Cycle Time</TableColumn>
                            <TableColumn key="avgtimesamped">Avg Times Amped</TableColumn>
                            <TableColumn key="avgtrap">Avg Trap</TableColumn>
                            <TableColumn key="avgdefense">Avg Defense</TableColumn>
                            <TableColumn key="avgreliability">Avg Reliablity</TableColumn>
                            <TableColumn key="hang">Usually Hangs</TableColumn>
                            <TableColumn key="pickup">Main Pickup</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={allAverages}
                            loadingContent={<Spinner label="Loading..."/>}
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        #{
                                        item.ranking
                                    }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.teamNumber
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.intake
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgampauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgspeakerauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgampteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgspeakerteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            (135 / (item.avgampteleop + item.avgspeakerteleop)).toFixed(1)
                                        }
                                        sec
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgtimesamped
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgtrap
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgdefense
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.avgreliability
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(item.hang)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.pickup
                                        }
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                )}
            </div>
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
            ) : teamData && !usersLoading ? (
                <>
                    <div>
                        <p className={'p-2 text-lg'}>Best:</p>
                        <Table
                            key={teamBest?.id}
                        >
                            <TableHeader>
                                <TableColumn key="intake">Intake</TableColumn>
                                <TableColumn key="avgampauton">Auton Amp</TableColumn>
                                <TableColumn key="avgspeakerauton">Auton Speaker</TableColumn>
                                <TableColumn key="avgampteleop">Teleop Amp</TableColumn>
                                <TableColumn key="avgspeakerteleop">Teleop Speaker</TableColumn>
                                <TableColumn key="avgcycletime">Cycle Time</TableColumn>
                                <TableColumn key="avgtrap">Trap</TableColumn>
                                <TableColumn key="avgdefense">Defense</TableColumn>
                                <TableColumn key="avgreliability">Reliablity</TableColumn>
                                <TableColumn key="hang">Usually Hangs</TableColumn>
                                <TableColumn key="pickup">Usual Pickup</TableColumn>
                            </TableHeader>

                            <TableBody>
                                <TableRow key={teamBest?.id}>
                                    <TableCell>
                                        {
                                            teamBest?.intake
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.ampauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.speakerauton
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.ampteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.speakerteleop
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            (135 / ((teamBest?.ampteleop ?? 0) + (teamBest?.speakerteleop ?? 0))).toFixed(1)
                                        }
                                        sec
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.trap
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.defense
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.reliability
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            String(teamBest?.hang)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamBest?.pickup
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </div>

                    <div>
                        <p className={'p-2 text-lg'}>Averages:</p>
                        <Table
                            key={teamAverages?.id}
                        >
                            <TableHeader>
                                <TableColumn key="intake">Intake</TableColumn>
                                <TableColumn key="avgampauton">Auton Amp</TableColumn>
                                <TableColumn key="avgspeakerauton">Auton Speaker</TableColumn>
                                <TableColumn key="avgampteleop">Teleop Amp</TableColumn>
                                <TableColumn key="avgspeakerteleop">Teleop Speaker</TableColumn>
                                <TableColumn key="avgcycletime">Avg Cycle Time</TableColumn>
                                <TableColumn key="avgtimesamped">Times Amped</TableColumn>
                                <TableColumn key="avgtrap">Trap</TableColumn>
                                <TableColumn key="avgdefense">Misc Defense</TableColumn>
                                <TableColumn key="avgreliability">Misc Reliablity</TableColumn>
                                <TableColumn key="hang">Usually Hangs</TableColumn>
                                <TableColumn key="pickup">Pickup</TableColumn>
                            </TableHeader>

                            <TableBody>
                                <TableRow key={teamAverages?.id}>
                                    <TableCell>
                                        {
                                            teamAverages?.intake
                                        }
                                    </TableCell>
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
                                            (135 / ((teamAverages?.avgampteleop ?? 0) + (teamAverages?.avgspeakerteleop ?? 0))).toFixed(1)
                                        }
                                        sec
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
                                    <TableCell>
                                        {
                                            String(teamAverages?.hang)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            teamAverages?.pickup
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
                            <TableColumn key="miscReliability">Avg Cycle Time</TableColumn>
                            <TableColumn key="teleopTimesAmped">Teleop Times Amped</TableColumn>
                            <TableColumn key="teleopPickupFrom">Teleop Pickup From</TableColumn>
                            <TableColumn key="teleopIsHanging">Teleop Is Hanging</TableColumn>
                            <TableColumn key="teleopTrap">Teleop Trap</TableColumn>
                            <TableColumn key="teleopSpotLight">Teleop Spotlit</TableColumn>
                            <TableColumn key="miscDefense">Misc Defense</TableColumn>
                            <TableColumn key="miscReliability">Misc Reliability</TableColumn>
                            <TableColumn key="scouter">Scouter</TableColumn>
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
                                            (135 / (item.teleop.amp + item.teleop.speaker)).toFixed(1)
                                        }
                                        sec
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
                                    <TableCell>
                                        {
                                            getUser(item.scouterId)?.name
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <p className={'p-2 text-lg'}>Auto Comments:</p>
                    <Table>
                        <TableHeader>
                            <TableColumn key="matchNumber">Match Number</TableColumn>
                            <TableColumn key="comments">Comments</TableColumn>
                            <TableColumn key="scouter">Scouter</TableColumn>
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
                                            item.auton.comments
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            getUser(item.scouterId)?.name
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <p className={'p-2 text-lg'}>Teleop Comments:</p>
                    <Table>
                        <TableHeader>
                            <TableColumn key="matchNumber">Match Number</TableColumn>
                            <TableColumn key="comments">Comments</TableColumn>
                            <TableColumn key="scouter">Scouter</TableColumn>
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
                                            item.teleop.comments
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            getUser(item.scouterId)?.name
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <p className={'p-2 text-lg'}>Misc Comments:</p>
                    <Table>
                        <TableHeader>
                            <TableColumn key="matchNumber">Match Number</TableColumn>
                            <TableColumn key="comments">Comments</TableColumn>
                            <TableColumn key="scouter">Scouter</TableColumn>
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
                                            item.misc.comments
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            getUser(item.scouterId)?.name
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