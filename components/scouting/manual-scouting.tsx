'use client';

import React, {useState} from 'react';
import '@/app/globals.css';
import {Input} from '@nextui-org/react';
import {useRouter} from "next/navigation";

export default function ManualScouting() {
    const [teamNumber, setTeamNumber] = useState('');
    const router = useRouter();

    const loadForm = () => {
        if (teamNumber && /^\d+$/.test(teamNumber)) {
            router.push(`/scouting/practice?robot=${teamNumber}`)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(event.target.value.replace(/\D/g, ''));
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
