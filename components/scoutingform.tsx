import { ScoutingFormData } from '@/types/form';
import React from 'react';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Auton</h1>
            <div className="grid grid-cols-2 text-2xl">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
            </div>
            <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Teleop</h1>
            <div className="grid grid-cols-2 text-2xl">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
            </div>
            <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Misc</h1>
            <div className="grid grid-cols-2 text-2xl">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
            </div>
        </div>
    )
}

export default ScoutingForm;