'use client';

import {Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import React from 'react';
import {Dispute} from "@/types/dispute";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {faCheck, faTrashCan} from "@fortawesome/free-solid-svg-icons";


const AcceptDisputes = ({disputes, loading}: {
    disputes: Dispute[],
    loading: boolean,
}) => {
    const convertTextToTitle = (text: string) => {
        const parts = text.split('_');

        const type = parts[0].substring(4).toUpperCase();
        const qualifier = parts[1].substring(2);

        // Constructing the final title
        return `${type} Qual ${qualifier}`;
    }

    const router = useRouter();
    const acceptEntry = async (id: number) => {
        try {
            toast.loading('Accepting Dispute. Please wait... Do not spam button.');
            const response = await axios.post('/api/disputes/action?action=accept', {
                id
            });
            toast.success('Dispute Accepted');
            router.push("/dashboard");
        } catch (error) {
            toast.error('Error accepting disputes');
        }
    }

    const deleteEntry = async (id: number) => {
        try {
            toast.loading('Deleting Dispute. Please wait... Do not spam button.');
            const response = await axios.post('/api/disputes/action?action=delete', {
                id
            });
            toast.success('Dispute Deleted');
            router.push("/dashboard");
        } catch (error) {
            toast.error('Error deleting disputes');
        }
    }

    return (
        <>
            <div className='max-w-full'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {disputes.length === 0 ? (
                            <p>No disputes</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableColumn key="match">Match</TableColumn>
                                    <TableColumn key="fromScouter">From Scouter</TableColumn>
                                    <TableColumn key="actions" align={"end"}>Actions</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={disputes}
                                    loadingContent={<Spinner label="Loading..."/>}
                                >
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className='flex-grow'>
                                                    {convertTextToTitle(item.matchID)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.scouter.name}
                                            </TableCell>
                                            <TableCell align={"right"}>
                                                <div className={"flex justify-evenly"}>
                                                    <button onClick={() => acceptEntry(item.id)}>
                                                        <FontAwesomeIcon
                                                            icon={faCheck}/>
                                                    </button>
                                                    <button onClick={() => deleteEntry(item.id)}>
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
                    </>
                )}
            </div>
        </>
    );
};

export default AcceptDisputes;