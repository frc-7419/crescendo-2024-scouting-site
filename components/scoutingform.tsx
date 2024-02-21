import { ScoutingFormData } from '@/types/form';
import { Autocomplete, AutocompleteItem, Button, Checkbox, Input, Textarea } from '@nextui-org/react';
import React, { FormEvent } from 'react';
import frcMap from '@/resources/frcmap.png';
import Image from 'next/image';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    const ScoutModule = ({ text, key, type, className, items = [], min, max }: { text: string, key: string, type: string, className?: string, items?: { key: string, value: string }[], min?: number, max?: number }) => {
        return (
            <div className={`${className} pt-4 pb-4 pr-4 flex justify-between items-center`}>
                <p>{text}</p>
                {type === 'checkbox' && <Checkbox name={key} key={key} color="primary"></Checkbox>}
                {type === 'number' && <Input name={key} placeholder='0' className="w-25" variant='bordered' key={key} type="number" />}
                {type === 'dropdown' && (
                    <Autocomplete
                        label={text}
                        isRequired
                        className="max-w-xs"
                        name={key}
                        key={key}
                    >
                        {items?.map(({ key: itemKey, value: itemValue }) => (
                            <AutocompleteItem key={itemKey} value={itemValue}>
                                {itemValue}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                )}
                {type === 'datetime' && <Input isRequired className="w-25" variant='bordered' key={key} name={key} type="time" />}
                {type === 'range' && <Input isRequired className="w-25" variant='bordered' key={key} name={key} type="range" min={min} max={max} />}
            </div>
        )
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log('Form data:', Object.fromEntries(formData.entries()));
    }
    const ScoutCommentModule = ({ text, key }: { text: string, key: string }) => {
        return (
            <div className='pt-4 pb-4 col-start-1 col-end-3'>
                <p className='pb-4'>{text}</p>
                <Textarea variant="faded" key={key} color='primary' />
            </div>
        )
    }
    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <form onSubmit={handleSubmit}>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Auton</h1>
                    <div className="grid grid-cols-2 grid-rows-3 text-3xl font-thin">
                        <ScoutModule text="Has Preload" key="preload" type='checkbox' />
                        <ScoutModule className="pl-4" text="Left Community" key="leftCommunity" type='checkbox' />
                        <ScoutModule text="Speaker" key="speaker" type='number' />
                        <ScoutModule className="pl-4" text="Amp" key="amp" type='number' />
                        <ScoutCommentModule text="Comments" key="comments" />
                    </div>
                </div>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Teleop</h1>
                    <div className="grid grid-cols-2 grid-rows-7 text-3xl font-thin">
                        <ScoutModule text="Defensive" key="defensive" type='checkbox' />
                        <ScoutModule className="pl-4" text="Intake" key="intake" type='dropdown' items={
                            [
                                { key: 'OTB', value: 'Over the Bumper' },
                                { key: 'UTB', value: 'Under the Bumper' },]
                        } />
                        <ScoutModule text="Amp" key="amp" type='number' />
                        <ScoutModule className="pl-4" text="Speaker" key="speaker" type='number' />
                        <ScoutModule text="Times Amped" key="timesAmped" type='number' />
                        <ScoutModule className="pl-4" text="Pickup From" key="pickupFrom" type='dropdown' items={[
                            { key: 'FLOOR', value: 'Floor' },
                            { key: 'SOURCE', value: 'Source' },
                            { key: 'BOTH', value: 'Both' },
                            { key: 'NOT_ATTEMPTED', value: 'Did Not Attempt' },
                        ]} />
                        <ScoutModule text="Is Disabled" key="isDisabled" type='checkbox' />
                        <ScoutModule className="pl-4" text="Disabled At" key="disabledAt" type='datetime' />
                        <ScoutModule text="Is Hanging" key="isHanging" type='checkbox' />
                        <ScoutModule className="pl-4" text="Trap" key="trap" type='number' />
                        <ScoutModule text="Spot Light" key="spotLight" type='checkbox' />
                        <ScoutCommentModule text="Comments" key="comments" />
                    </div>
                </div>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Misc</h1>
                    <div className="grid grid-cols-2 grid-rows-2 text-3xl font-thin">
                        <ScoutModule text="Defense" key="defense" type='dropdown' items={[
                            { key: '0', value: 'Did Not Play Defense' },
                            { key: '1', value: 'Poor' },
                            { key: '2', value: 'Fair' },
                            { key: '3', value: 'Good' },
                            { key: '4', value: 'Excellent' },
                        ]} />
                        <ScoutModule text="Reliability" key="reliability" type='dropdown' items={[
                            { key: '1', value: '1 - Dropped Many Notes, Unstable Cycle Times' },
                            { key: '2', value: '2 - Some Drops, Inconsistent Cycle Times' },
                            { key: '3', value: '3 - Few Drops, Fairly Consistent Cycle Times' },
                            { key: '4', value: '4 - Rare Drops, Consistent Cycle Times' },
                            { key: '5', value: '5 - No Drops, Consistent Cycle Times' }
                        ]} />
                        <ScoutCommentModule text="Comments" key="comments" />
                    </div>
                </div>
                <Button fullWidth color="primary" size="lg" variant="shadow" type='submit'>
                    Submit
                </Button>
            </form >
        </div >
    )
}

export default ScoutingForm;