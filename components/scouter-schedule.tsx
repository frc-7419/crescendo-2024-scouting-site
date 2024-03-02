'use client';

import {Match} from '@/types/match';
import {Scouter} from '@/types/schedule';
import {faCog, faMailForward, faUser, faWarning} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from '@nextui-org/react';
import Link from 'next/link';
import React, {Key, useContext, useEffect, useState} from 'react';
import {getCurrentEvent} from '@/components/getCurrentEvent';
import axios from 'axios';
import {LoadStatusContext} from './LoadStatusContext';
import toast from 'react-hot-toast';


const ScouterSchedule = ({matches, loading, time, shifts}: {
    matches: Match[],
    loading: any,
    time: Date,
    shifts: Scouter[]
}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };

    const eventKey = getCurrentEvent();

    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
    const [users, setUsers] = useState<{ name: string; uuid: string }[]>([]);
    const [usersRequested, setUsersRequested] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const [disputeUser, setDisputeUser] = useState<Key>('');
    const [reason, setReason] = useState('');
    const [matchId, setMatchId] = useState('');
    const [submittingDispute, setSubmittingDispute] = useState(false);

    useEffect(() => {

        const filtered = matches.filter((match: Match) => shifts.some((shift) => shift.ScoutingSchedule?.matchID === match.key));
        setFilteredMatches(filtered);
    }, [matches, shifts]);



    const PopButton = ({icon, text}: { icon: JSX.Element, text: string }) => {
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

    const openModal = (matchId: string) => {
        setMatchId(matchId);
        onOpen();
    }

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        if (submittingDispute) return;
        setSubmittingDispute(true);
        toast.loading('Submitting Dispute. Please wait... Do not spam button.');
        e.preventDefault();
        try {
            const response = await axios.post('/api/disputes/create', {
                reason,
                matchId,
                disputeUser
            });
            toast.success('Dispute submitted');
        } catch (error) {
            toast.error('Error submitting disputes');
        }
        setSubmittingDispute(false);
    }
    return (
        <>
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
                                    loadingContent={<Spinner label="Loading..."/>}
                                >
                                    {(item) => (
                                        <TableRow key={item.key}>
                                            <TableCell>
                                                <div className='flex flex-row items-center gap-4'>
                                                    <div
                                                        className={`${(getScoutedTeam(item).alliance == "Blue Alliance") ? 'bg-blue-600' : 'bg-red-600'} w-3 h-3`}></div>
                                                    {new Date(item.predicted_time * 1000).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
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
                                                        <span>You are scouting {getScoutedTeam(item).team} on the {getScoutedTeam(item).alliance}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* waiting for form component */}
                                                <Link href={`/scouting/${item.key}`} className='text-center'>Open
                                                    Form</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Popover showArrow>
                                                    <PopoverTrigger>
                                                        <button>
                                                            <FontAwesomeIcon className='hover:animate-spin'
                                                                             icon={faCog}/>
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="text-xl">
                                                        <Listbox
                                                            aria-label="Actions"
                                                        >
                                                            <ListboxItem key="settings"
                                                                         onClick={() => openModal(item.key)}>
                                                                <PopButton
                                                                    icon={<FontAwesomeIcon icon={faMailForward}/>}
                                                                    text="Dispute"
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
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={(e) => submitHandler(e)}>
                                <ModalHeader className="flex flex-col gap-1">Dispute</ModalHeader>
                                <ModalBody>
                                    <Input
                                        isRequired
                                        autoFocus
                                        endContent={
                                            <FontAwesomeIcon icon={faWarning}
                                                             className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Reason for Dispute"
                                        placeholder="i dont feel like it"
                                        variant="bordered"
                                        type='text'
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Autocomplete
                                        isRequired
                                        autoComplete='off'
                                        label="Send to User"
                                        defaultItems={users}
                                        isLoading={usersLoading}
                                        name="disputeUser"
                                        placeholder="User"
                                        type="text"
                                        onSelectionChange={setDisputeUser}
                                        variant='bordered'
                                        endContent={
                                            <FontAwesomeIcon icon={faUser}
                                                             className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                    >
                                        {(user) => (
                                            <AutocompleteItem key={user.uuid} value={user.name}>
                                                {user.name}
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" type='submit' isLoading={submittingDispute}
                                            onPress={onClose}>
                                        Submit
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ScouterSchedule;