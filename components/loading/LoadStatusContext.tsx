import React from 'react';

export const LoadStatusContext = React.createContext<{
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);