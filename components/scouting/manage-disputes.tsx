'use client';

import {Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import React from 'react';
import {Dispute} from "@/types/dispute";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Loadinganim from "@/components/loading/loadinganim";


const ManageDisputes = ({disputes, loading}: {
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
    const deleteEntry = async (id: number) => {
        try {
            toast.loading('Deleting Dispute. Please wait... Do not spam button.');
            await axios.post('/api/disputes/action?action=delete', {
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
                    <Loadinganim/>
                ) : (
                    <>
                        {disputes.length === 0 ? (
                            <p>No disputes</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableColumn key="match">Match</TableColumn>
                                    <TableColumn key="toScouter">To Scouter</TableColumn>
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
                                                {item.toScouter.name}
                                            </TableCell>
                                            <TableCell align={"right"}>
                                                <button onClick={() => deleteEntry(item.id)}>
                                                    <FontAwesomeIcon
                                                        icon={faTrashCan}/>
                                                </button>
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

export default ManageDisputes;