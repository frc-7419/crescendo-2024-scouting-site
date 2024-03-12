'use client';

import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
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
import {LoadStatusContext} from '../loading/LoadStatusContext';
import {getAverages, getBests, getPicklist, getRankings} from "@/components/fetches/apicalls";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {AvgModal, BestModal} from "@/types/scoutingform";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {Picklist as Picklisttype} from "@/types/Picklist";
import toast from "react-hot-toast";
import {RankingsData} from "@/types/Rankings";
import axios from "axios";

export default function Picklist() {
    const {setValue} = useContext(LoadStatusContext) as {
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
    const [sortBy, setSortBy] = useState("overall")
    const [desc, setDesc] = useState(true)
    const [picklist, setPicklist] = useState<Picklisttype[]>([]);
    const [rankings, setRankings] = useState<RankingsData>();
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        console.log(picklist)
    }, [picklist]);

    const avgSortByMap = {
        "overall": "overall",
        "ampauton": "avgampauton",
        "speakerauton": "avgspeakerauton",
        "ampteleop": "avgampteleop",
        "speakerteleop": "avgspeakerteleop",
        "trap": "avgtrap",
        "defense": "avgdefense",
        "reliability": "avgreliability",
    };

    const bestSortByMap = {
        "overall": "overall",
        "ampauton": "ampauton",
        "speakerauton": "speakerauton",
        "ampteleop": "ampteleop",
        "speakerteleop": "speakerteleop",
        "trap": "trap",
        "defense": "defense",
        "reliability": "reliability",
    };

    const sortCatg = [
        {label: "Overall", value: "overall"},
        {label: "Amp Auton", value: "ampauton"},
        {label: "Speaker Auton", value: "speakerauton"},
        {label: "Amp Teleop", value: "ampteleop"},
        {label: "Speaker Teleop", value: "speakerteleop"},
        {label: "Trap", value: "trap"},
        {label: "Defense", value: "defense"},
        {label: "Reliability", value: "reliability"},
    ]

    const toggleDesc = () => {
        setDesc(!desc);
    }
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
            case "reliability": {
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
            ranking: index + 1,
            overall: item.avgampauton + item.avgspeakerauton + item.avgampteleop + item.avgspeakerteleop
        }));
        if (!desc) data.reverse();
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
            case "reliability": {
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
            ranking: index + 1,
            overall: item.ampauton + item.speakerauton + item.ampteleop + item.speakerteleop
        }));
        if (!desc) data.reverse();
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
    }, [sortBy, desc]);
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

    const fetchRankings = async () => {
        try {
            setRankings(await getRankings(getCurrentEvent()))
        } catch (error) {
            console.error(error);
            setErrored(true);
            setValue(500);
        }
    }

    const loadPicklist = async () => {
        try {
            const pl = await getPicklist(getCurrentEvent())
            setPicklist(pl);
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
        fetchRankings()
        loadPicklist()
    }, []);

    const getRank = (team: string) => {
        if (!rankings || !rankings.rankings || rankings.rankings.length === 0) return 0;

        const index = rankings.rankings.findIndex((item) => item.team_key === `frc${team}`);

        if (index === -1) return 0;

        return rankings.rankings[index].rank;
    }


    const getPointAvg = (team: string) => {
        if (allAverages.length == 0) return 0;
        const index = allAverages.findIndex((item) => item.teamNumber == team);
        return (allAverages[index].avgampauton + allAverages[index].avgspeakerauton + allAverages[index].avgampteleop + allAverages[index].avgspeakerteleop).toFixed(2);
    }

    const addToPicklist = (teamNumber: string) => {
        setPicklist(prevPicklist => {
            if (prevPicklist.some(item => item.teamNumber === teamNumber)) {
                toast.error("Team already added to picklist.");
                return prevPicklist;
            }
            return [...prevPicklist, {teamNumber}];
        });
    };

    const removeFromPicklist = (teamNumber: string) => {
        setPicklist(prevPicklist => prevPicklist.filter(item => item.teamNumber !== teamNumber));
    };

    const moveItemUp = (teamNumber: string) => {
        setPicklist(prevPicklist => {
            const index = prevPicklist.findIndex(item => item.teamNumber === teamNumber);
            if (index === -1 || index === 0) {
                // Item not found or already at the top, no need to move
                return prevPicklist;
            }
            const newPicklist = [...prevPicklist];
            // Swap current item with the one above it
            [newPicklist[index - 1], newPicklist[index]] = [newPicklist[index], newPicklist[index - 1]];
            return newPicklist;
        });
    };

    const uploadPicklist = async () => {
        setValue(0);
        setUploading(true);
        await axios.post('/api/picklist/put', picklist)
            .then(() => {
                setValue(100);
                toast.success("Picklist saved successfully.");
            })
            .catch(() => {
                setValue(500);
                toast.error("Failed to save picklist.");
            }).finally(
                () => setUploading(false)
            )
    }

    const moveItemDown = (teamNumber: string) => {
        setPicklist(prevPicklist => {
            const index = prevPicklist.findIndex(item => item.teamNumber === teamNumber);
            if (index === -1 || index === prevPicklist.length - 1) {
                // Item not found or already at the bottom, no need to move
                return prevPicklist;
            }
            const newPicklist = [...prevPicklist];
            // Swap current item with the one below it
            [newPicklist[index], newPicklist[index + 1]] = [newPicklist[index + 1], newPicklist[index]];
            return newPicklist;
        });
    };

    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <div className={"flex justify-between"}>
                <h1 className="text-2xl font-semibold">Picklist</h1>
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
            <Card
                isBlurred
                className='mt-4'
            >
                <CardBody>
                    <Table aria-label="Pick List">
                        <TableHeader>
                            <TableColumn>Team</TableColumn>
                            <TableColumn>Rank</TableColumn>
                            <TableColumn>Point Avg</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={picklist}
                            loadingContent={<Spinner label="Loading..."/>}
                        >
                            {(item) => (
                                <TableRow key={item.teamNumber}>
                                    <TableCell>{item.teamNumber}</TableCell>
                                    <TableCell>{getRank(item.teamNumber)}</TableCell>
                                    <TableCell>{getPointAvg(item.teamNumber)}</TableCell>
                                    <TableCell>
                                        <div className={'flex justify-evenly'}>
                                            <button onClick={() => removeFromPicklist(item.teamNumber)}>-</button>
                                            <button onClick={() => moveItemUp(item.teamNumber)}><FontAwesomeIcon
                                                icon={faArrowUp}/></button>
                                            <button onClick={() => moveItemDown(item.teamNumber)}><FontAwesomeIcon
                                                icon={faArrowDown}/></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Button color={"primary"} onClick={uploadPicklist} isLoading={uploading}>Save</Button>
                </CardBody>
            </Card>
            {!averagesLoaded && !bestsLoaded ? (
                <div className={"p-2"}>
                    <p>Loading</p>
                </div>
            ) : (
                errored ? (
                    <div className={"p-2"}>
                        <p>There was an error loading the leaderboard</p>
                    </div>
                ) : (
                    <Card
                        isBlurred
                        className='mt-4'
                    >
                        <CardBody>
                            {(selectedTab == "avg") ? (
                                <>
                                    <div className="mt-4 flex pb-2 align-middle">
                                        <p className={'p-2 text-lg grow'}>Average Situation</p>
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
                                        <button onClick={toggleDesc} className={'p-6'}>
                                            <FontAwesomeIcon className={'text-xl'} icon={desc ? faSortDown : faSortUp}/>
                                        </button>
                                    </div>
                                    <div className={'max-h-96 mb-4'}>
                                        {sortedAverages.length != 0 && (
                                            <Table
                                                key={"allAverages"}
                                                isHeaderSticky
                                                className={'max-h-96'}
                                            >
                                                <TableHeader>
                                                    <TableColumn key="actions">Actions</TableColumn>
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
                                                                <button
                                                                    onClick={() => addToPicklist(item.teamNumber)}>+
                                                                </button>
                                                            </TableCell>
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
                                    <div className="mt-4 flex pb-2 align-middle">
                                        <p className={'p-2 text-lg grow'}>Best Situation</p>
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
                                        <button onClick={toggleDesc} className={'p-6'}>
                                            <FontAwesomeIcon className={'text-xl'} icon={desc ? faSortDown : faSortUp}/>
                                        </button>
                                    </div>
                                    <div className={'max-h-96 mb-4'}>
                                        {sortedBest.length != 0 && (
                                            <Table
                                                key={"allBest"}
                                                isHeaderSticky
                                                className={'max-h-96'}
                                            >
                                                <TableHeader>
                                                    <TableColumn key="actions">Actions</TableColumn>
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
                                                    items={sortedBest}
                                                    loadingContent={<Spinner label="Loading..."/>}
                                                >
                                                    {(item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <button
                                                                    onClick={() => addToPicklist(item.teamNumber)}>+
                                                                </button>
                                                            </TableCell>
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
                        </CardBody>
                    </Card>
                ))}
        </div>
    )
}