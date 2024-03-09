import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';
import {Badge, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import axios from "axios";
import {LoadStatusContext} from "@/components/loading/LoadStatusContext";
import {Dispute} from "@/types/dispute";

export default function Notifications() {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);

    const convertTextToTitle = (text: string) => {
        const parts = text.split('_');

        const type = parts[0].substring(4).toUpperCase();
        const qualifier = parts[1].substring(2);

        // Constructing the final title
        return `${type} Qual ${qualifier}`;
    }

    useEffect(() => {
        try {
            axios.get(`/api/disputes/get/sent`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                },
            })
                .then(response => response.data)
                .then(data => {
                    console.debug(data);
                    setDisputes(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Popover placement="bottom" showArrow={true}>
            <PopoverTrigger>
                <button>
                    <Badge content={disputes.length} color="primary" isInvisible={disputes.length <= 0}>
                        <FontAwesomeIcon icon={faBell} size="xl" fixedWidth
                                         className='transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300'/>
                    </Badge>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2">
                    <div className="text-lg font-bold">Notifications</div>
                    {disputes.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        <div>
                            {disputes.map((dispute) => (
                                <div key={dispute.id} className={'mb-2'}>
                                    <div className="text-md">{dispute.scouter.name} sent a request for you to take
                                        over {convertTextToTitle(dispute.matchID)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
        ;
}