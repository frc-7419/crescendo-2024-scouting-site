import { ScoutingFormData } from '@/types/form';
import { Checkbox } from '@nextui-org/react';
import React from 'react';
import frcMap from '@/resources/frcmap.png';
import Image from 'next/image';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    const ScoutModule = ({ text, key }: { text: string, key: string }) => {
        return (
            <div className='pt-4 pb-4 pr-4 flex justify-between items-center'>
                <p>{text}</p>
                <Checkbox key={key} color="primary"></Checkbox>
            </div>
        )
    }
    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <form>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Auton</h1>
                    <div className="grid grid-cols-2 grid-rows-8 text-3xl font-thin gap-4">
                        <ScoutModule text="Has Preload" key="preload" />
                        <div className='pt-4 pb-4 pr-4 row-start-1 row-end-5 col-start-2 col-end-3'>
                            <Image src={frcMap.src} alt="FRC Map" width={frcMap.width} height={frcMap.height} />
                        </div>
                        <ScoutModule text="Left Community" key="leftCommunity" />
                        <ScoutModule text="Left Community" key="leftCommunity" />
                        <ScoutModule text="Left Community" key="leftCommunity" />
                        <ScoutModule text="Left Community" key="leftCommunity" />
                        <ScoutModule text="Left Community" key="leftCommunity" />

                    </div>
                </div>
                <div className='pb-4'>
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
                </div>
                <div className='pb-4'>
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
            </form >
        </div >
    )
}

export default ScoutingForm;