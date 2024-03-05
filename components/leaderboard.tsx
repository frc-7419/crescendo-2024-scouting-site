'use client';

import React, {useContext, useEffect, useState} from 'react';
import {
    Select,
    SelectItem,
    Spinner,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tabs
} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {getAverages, getBests} from "@/components/fetches/apicalls";
import {getCurrentEvent} from "@/components/getCurrentEvent";
import {AvgModal, BestModal} from "@/types/scoutingform";

export default function Leaderboard() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [allAverages, setAllAverages] = useState<AvgModal[]>([]);
    const [averagesLoaded, setAveragesLoaded] = useState(false)
    const [allBest, setAllBest] = useState<BestModal[]>([]);
    const [bestsLoaded, setBestsLoaded] = useState(false)
    const [selectedTab, setSelectedTab] = useState("avg")
    const [errored, setErrored] = useState(false)
    const [sortedAverages, setSortedAverages] = useState<AvgModal[]>([]);
    const [sortedBest, setSortedBest] = useState<BestModal[]>([]);
    const [sortBy, setSortBy] = useState("")
    const sortCatg = [
        {label: "Overall", value: "overall"},
        {label: "Amp Auton", value: "ampauton"},
        {label: "Speaker Auton", value: "speakerauton"},
        {label: "Amp Teleop", value: "ampteleop"},
        {label: "Speaker Teleop", value: "speakerteleop"},
        {label: "Trap", value: "trap"},
        {label: "Defense", value: "defense"},
        {label: "Reliability", value: "reliablilty"},
    ]
    const sortAverages = () => {
        let sa: AvgModal[];
        switch (sortBy) {
            case "ampauton": {
                sa = allAverages.sort((a, b) => b.avgampauton - a.avgampauton);
                break;
            }
            case "speakerauton": {
                sa = allAverages.sort((a, b) => b.avgspeakerauton - a.avgspeakerauton);
                break;
            }
            case "ampteleop": {
                sa = allAverages.sort((a, b) => b.avgampteleop - a.avgampteleop);
                break;
            }
            case "speakerteleop": {
                sa = allAverages.sort((a, b) => b.avgspeakerteleop - a.avgspeakerteleop);
                break;
            }
            case "trap": {
                sa = allAverages.sort((a, b) => b.avgtrap - a.avgtrap);
                break;
            }
            case "defense": {
                sa = allAverages.sort((a, b) => b.avgdefense - a.avgdefense);
                break;
            }
            case "reliablilty": {
                sa = allAverages.sort((a, b) => b.avgreliability - a.avgreliability);
                break;
            }
            default: {
                sa = allAverages.sort((a, b) => {
                    const sumA = a.avgampauton + a.avgspeakerauton + a.avgampteleop + a.avgspeakerteleop;
                    const sumB = b.avgampauton + b.avgspeakerauton + b.avgampteleop + b.avgspeakerteleop;
                    return sumB - sumA;
                });
                break;
            }
        }
        const data = sa.map((item, index) => ({
            ...item,
            ranking: index + 1
        }));
        setSortedAverages(data);
    }

    const sortBests = () => {
        let sb: BestModal[];
        switch (sortBy) {
            case "ampauton": {
                sb = allBest.sort((a, b) => b.ampauton - a.ampauton);
                break;
            }
            case "speakerauton": {
                sb = allBest.sort((a, b) => b.speakerauton - a.speakerauton);
                break;
            }
            case "ampteleop": {
                sb = allBest.sort((a, b) => b.ampteleop - a.ampteleop);
                break;
            }
            case "speakerteleop": {
                sb = allBest.sort((a, b) => b.speakerteleop - a.speakerteleop);
                break;
            }
            case "trap": {
                sb = allBest.sort((a, b) => b.trap - a.trap);
                break;
            }
            case "defense": {
                sb = allBest.sort((a, b) => b.defense - a.defense);
                break;
            }
            case "reliablilty": {
                sb = allBest.sort((a, b) => b.reliability - a.reliability);
                break;
            }
            default: {
                sb = allBest.sort((a, b) => {
                    const sumA = a.ampauton + a.speakerauton + a.ampteleop + a.speakerteleop;
                    const sumB = b.ampauton + b.speakerauton + b.ampteleop + b.speakerteleop;
                    return sumB - sumA;
                });
                break;
            }
        }
        const data = sb.map((item, index) => ({
            ...item,
            ranking: index + 1
        }));
        setSortedBest(data);
    }

    useEffect(() => {
        sortAverages()
    }, [allAverages])

    useEffect(() => {
        sortBests()
    }, [allBest])

    useEffect(() => {
        sortAverages()
        sortBests()
    }, [sortBy]);
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

    const fetchAllBest = async () => {
        if (bestsLoaded) return;
        try {
            const bests = await getBests(getCurrentEvent())
            setAllBest(bests);
            setBestsLoaded(true)
            setValue(100);
        } catch (error) {
            console.error(error);
            setErrored(true);
            setValue(500);
        }
    }
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value)
    };

    useEffect(() => {
        fetchAllAverages()
        fetchAllBest()
    }, []);

    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <div className={"flex justify-between"}>
                <h1 className="text-2xl font-semibold">Leaderboard</h1>
                <Tabs
                    aria-label="Tabs colors"
                    radius="full"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(String(key))}
                >
                    <Tab key="avg" title="Avg"/>
                    <Tab key="best" title="Best"/>
                </Tabs>
            </div>
            {errored ? (
                <div className={"p-2"}>
                    <p>There was an error loading the leaderboard</p>
                </div>
            ) : (
                <>
                    {(selectedTab == "avg") ? (
                        <>
                            <div className="mt-4 flex justify-between pb-2 align-middle">
                                <p className={'p-2 text-lg'}>Average Situation</p>
                                <Select
                                    label="Sort By"
                                    variant="bordered"
                                    placeholder="Overall"
                                    className="max-w-xs"
                                    onChange={handleSelectionChange}
                                >
                                    {sortCatg.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className={'max-h-96 mb-4'}>
                                {sortedAverages.length != 0 && (
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
                                            items={sortedAverages}
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
                        </>
                    ) : (
                        <>
                            <div className="mt-4 flex justify-between pb-2 align-middle">
                                <p className={'p-2 text-lg'}>Best Situation</p>
                                <Select
                                    label="Sort By"
                                    variant="bordered"
                                    placeholder="Overall"
                                    className="max-w-xs"
                                    onChange={handleSelectionChange}
                                >
                                    {sortCatg.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className={'max-h-96 mb-4'}>
                                {allBest.length != 0 && (
                                    <Table
                                        key={"allBest"}
                                        isHeaderSticky
                                        className={'max-h-96'}
                                    >
                                        <TableHeader>
                                            <TableColumn key="rank">#</TableColumn>
                                            <TableColumn key="team">Team</TableColumn>
                                            <TableColumn key="intake">Intake</TableColumn>
                                            <TableColumn key="avgampauton">Auton Amp</TableColumn>
                                            <TableColumn key="avgspeakerauton">Auton Speaker</TableColumn>
                                            <TableColumn key="avgampteleop">Teleop Amp</TableColumn>
                                            <TableColumn key="avgspeakerteleop">Teleop Speaker</TableColumn>
                                            <TableColumn key="avgcycletime">Cycle Time</TableColumn>
                                            <TableColumn key="avgtrap">Trap</TableColumn>
                                            <TableColumn key="avgdefense">Defense</TableColumn>
                                            <TableColumn key="avgreliability">Reliablity</TableColumn>
                                            <TableColumn key="hang">Hang</TableColumn>
                                            <TableColumn key="pickup">Pickup</TableColumn>
                                        </TableHeader>
                                        <TableBody
                                            items={allBest}
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
                                                            item.ampauton
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.speakerauton
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.ampteleop
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.speakerteleop
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            (135 / (item.ampteleop + item.speakerteleop)).toFixed(1)
                                                        }
                                                        sec
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.trap
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.defense
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.reliability
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
                        </>
                    )}
                </>
            )}
        </div>
    )
}