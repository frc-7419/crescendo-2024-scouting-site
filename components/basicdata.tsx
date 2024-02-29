'use client';

import React, {useContext, useEffect, useState} from 'react';
import '@/app/globals.css';
import {Input} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {getRobotData} from "@/components/fetches/apicalls";

export default function BasicData() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);

    const getTeamInfo = () => {
        if (teamNumber) {
            setErrored(false);
            setLoading(true);
            try {
                setValue(0);
                getRobotData(teamNumber)
                    .then(data => {
                        setTeamData(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                        setErrored(true);
                        setLoading(false);
                    });
                setValue(100)
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

    useEffect(() => {
        setValue(100);
    }, []);
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
                <></>
            ) : (
                <p>No data available. Please enter a valid team number.</p>
            )}
        </>
    );
}