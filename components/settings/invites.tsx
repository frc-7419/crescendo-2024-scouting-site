'use client';

import {Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Invite from "@/types/Invite";


const Invites = () => {
    const [invites, setInvites] = React.useState<Invite[]>([]);
    const [teamNumber, setTeamNumber] = React.useState<string>('');
    const getInvites = async () => {
        try {
            const response = await axios.get('/api/invites');
            setInvites(response.data);
        } catch (error) {
            toast.error('Error loading invites');
        }
    }

    useEffect(() => {
        getInvites();
    }, []);

    const createInvite = async (team: string) => {
        try {
            toast.loading('Creating invite. Please wait... Do not spam button.');
            await axios.post('/api/invites/create', {
                team
            });
            toast.success('Invite Created');
            getInvites();
        } catch (error) {
            toast.error('Error creating invite');
        }
    }
    const deleteInvite = async (id: number) => {
        try {
            toast.loading('Deleting invite. Please wait... Do not spam button.');
            await axios.post(`/api/invites/delete/${id}`)
            toast.success('Invite Deleted');
            getInvites();
        } catch (error) {
            toast.error('Error deleting invite');
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    return (
        <>
            <div className='max-w-full'>
                <div className='flex'>
                    <Input
                        fullWidth
                        autoComplete='off'
                        type="text"
                        value={teamNumber}
                        onChange={handleInputChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                createInvite(teamNumber);
                            }
                        }}
                        placeholder="Team Number. Quick Create Invite Code"
                    />
                </div>

                {invites.length === 0 ? (
                    <p>No invites</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableColumn key="match">Team</TableColumn>
                            <TableColumn key="fromScouter">Code</TableColumn>
                            <TableColumn key="actions" align={"end"}>Actions</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={invites}
                            loadingContent={<Spinner label="Loading..."/>}
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className='flex-grow'>
                                            {item.team}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.code}
                                    </TableCell>
                                    <TableCell align={"right"}>
                                        <div className={"flex justify-evenly"}>
                                            <button onClick={() => deleteInvite(item.id)}>
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}/>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
};

export default Invites;