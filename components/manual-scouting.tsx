'use client';

import React, {useContext, useState} from 'react';
import {Event} from '@/types/Event';
import {Team} from '@/types/Team';
import '@/app/globals.css';
import {Input} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';
import {useRouter} from "next/navigation";

export default function ManualScouting() {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [teamNumber, setTeamNumber] = useState('');
    const [teamInfo, setTeamInfo] = useState<Team | null>(null);
    const [teamEvents, setTeamEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<string>('2024');
    const router = useRouter();

    const loadForm = () => {
        if (teamNumber && /^\d+$/.test(teamNumber)) {
            router.push(`/scouting/practice?robot=${teamNumber}`)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
    };

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value);
    };

    return (
        <div className='flex'>
            <Input
                fullWidth
                autoComplete='off'
                type="text"
                value={teamNumber}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        loadForm();
                    }
                }}
                placeholder="Enter team number"
            />
        </div>
    );
}
