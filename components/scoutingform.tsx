import { ScoutingFormData } from '@/types/form';
import React from 'react';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <h1 className="text-4xl font-thin">Auton</h1>
            <div className="mt-4">
            </div>
        </div>
    )
}

export default ScoutingForm;