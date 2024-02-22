import { ScoutingFormData } from '@/types/form';
import { Autocomplete, AutocompleteItem, Button, Checkbox, Input, Textarea } from '@nextui-org/react';
import React, { FormEvent } from 'react';
import frcMap from '@/resources/frcmap.png';
import Image from 'next/image';
import { Controller, SubmitHandler, useController, useForm, useWatch } from 'react-hook-form';
import { ReturnedFormData, ScoutingData } from '@/types/scoutingform';
import { FieldValues } from 'react-hook-form';
import { faL } from '@fortawesome/free-solid-svg-icons';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    const { control, handleSubmit, formState: { errors }, getValues } = useForm();
    const validateNonNegative = (value: number) => {
        return value > 0 || 'Value must be non-negative';
    };

    function mapReturnedFormDataToFullFormData(data: ReturnedFormData): ScoutingData {
        return {
            matchNumber: formData.matchNumber,
            matchID: formData.matchId,
            teamNumber: Number(formData.team),
            venue: formData.venue,
            submitTime: new Date(),
            auton: {
                preload: data.preload ?? false,
                leftCommunity: data.leftCommunity ?? false,
                speaker: data.autospeaker ?? 0,
                amp: data.autoamp ?? 0,
                comments: data.autocomments ?? '',
            },
            teleop: {
                defensive: data.defensive ?? false,
                intake: data.intake,
                amp: data.teleopamp ?? 0,
                speaker: data.teleopspeaker ?? 0,
                timesAmped: data.timesAmped ?? 0,
                pickupFrom: data.pickupFrom,
                isRobotDisabled: data.isRobotDisabled ?? false,
                disabledAt: data.disabledAt,
                isHanging: data.isHanging ?? false,
                trap: data.trap ?? 0,
                spotLight: data.spotLight ?? false,
                comments: data.teleopcomments ?? '',
                finalStatus: data.isHanging ? (data.isHanging && data.spotLight ? 'ONSTAGE_SPOTLIT' : 'ONSTAGE') : 'PARKED'
            },
            misc: {
                defense: data.defense,
                reliability: data.reliability,
                comments: data.misccomments ?? ''
            },
            robot: {
                teamNumber: Number(formData.team)
            },
            scouter: {
                id: formData.scouterId
            }
        };
    }

    const ScoutModule = ({
        text,
        moduleKey,
        type,
        className,
        items = [],
        min,
        max,
        control,
        rules,
    }: {
        text: string;
        moduleKey: string;
        type: string;
        className?: string;
        items?: { key: string; value: string }[];
        min?: number;
        max?: number;
        control: any;
        rules?: any;
    }) => {
        return (
            <div className={`${className} pt-4 pb-4 pr-4 flex justify-between items-center`}>
                {type === 'checkbox' && (
                    <>
                        <p>{text}</p>
                        <Controller
                            name={moduleKey}
                            control={control}
                            render={({ field }) => <Checkbox {...field} color="primary" />}
                            rules={rules}
                        />
                    </>
                )}
                {type === 'number' && (
                    <>
                        <p>{text}</p>
                        <Controller
                            name={moduleKey}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="0"
                                    className="w-25"
                                    variant="bordered"
                                    type="number"
                                    isInvalid={!!errors[moduleKey]}
                                    errorMessage={errors[moduleKey]?.message as String}
                                />
                            )}
                            rules={rules}
                        />
                    </>
                )}
                {type === 'dropdown' && (
                    <>
                        <p>{text}</p>
                        <Controller
                            name={moduleKey}
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    label={text}
                                    isRequired
                                    className="max-w-xs"
                                    key={moduleKey}
                                    onSelectionChange={(value) => field.onChange(value)}
                                    value={field.value}
                                >
                                    {items?.map(({ key: itemKey, value: itemValue }) => (
                                        <AutocompleteItem key={itemKey} value={itemValue}>
                                            {itemValue}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            )}
                            rules={rules}
                        />
                    </>
                )}

                {type === 'datetime' && (
                    <>
                        <p>{text}</p>
                        <Controller
                            name={moduleKey}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="w-25" variant="bordered" type="time" defaultValue='00:00' />
                            )}
                            rules={rules}
                        />
                    </>
                )}
                {type === 'range' && (
                    <>
                        <p>{text}</p>
                        <Controller
                            name={moduleKey}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    className="w-25"
                                    variant="bordered"
                                    type="range"
                                    min={min}
                                    max={max}
                                />
                            )}
                            rules={rules}
                        />
                    </>
                )}
            </div>
        );
    };

    const ScoutCommentModule = ({ text, moduleKey, rules, control }: { text: string; moduleKey: string; control: any; rules?: any; }) => {
        return (
            <div className='pt-4 pb-4 col-start-1 col-end-3'>
                <p className='pb-4'>{text}</p>
                <Controller
                    name={moduleKey}
                    control={control}
                    render={({ field }) => (
                        <Textarea {...field} variant="faded" key={moduleKey} color='primary' />
                    )}
                />
            </div>
        )
    }


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(mapReturnedFormDataToFullFormData(data as ReturnedFormData));
    }

    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Auton</h1>
                    <div className="grid grid-cols-2 grid-rows-3 text-3xl font-thin">
                        <ScoutModule text="Has Preload" moduleKey="preload" type='checkbox' control={control} />
                        <ScoutModule className="pl-4" text="Left Community" moduleKey="leftCommunity" type='checkbox' control={control} />
                        <ScoutModule text="Speaker" moduleKey="autospeaker" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutModule className="pl-4" text="Amp" moduleKey="autoamp" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutCommentModule text="Comments" moduleKey="autocomments" control={control} />
                    </div>
                </div>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Teleop</h1>
                    <div className="grid grid-cols-2 grid-rows-7 text-3xl font-thin">
                        <ScoutModule text="Defensive" moduleKey="defensive" type='checkbox' control={control} />
                        <ScoutModule className="pl-4" text="Intake" moduleKey="intake" type='dropdown' items={
                            [
                                { key: 'OTB', value: 'Over the Bumper' },
                                { key: 'UTB', value: 'Under the Bumper' },]
                        } control={control} />
                        <ScoutModule text="Amp" moduleKey="teleopamp" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutModule className="pl-4" text="Speaker" moduleKey="teleopspeaker" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutModule text="Times Amped" moduleKey="timesAmped" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutModule className="pl-4" text="Pickup From" moduleKey="pickupFrom" type='dropdown' items={[
                            { key: 'FLOOR', value: 'Floor' },
                            { key: 'SOURCE', value: 'Source' },
                            { key: 'BOTH', value: 'Both' },
                            { key: 'NOT_ATTEMPTED', value: 'Did Not Attempt' },
                        ]} control={control} />
                        <ScoutModule text="Is Disabled" moduleKey="isRobotDisabled" type='checkbox' control={control} />
                        <ScoutModule className="pl-4" text="Disabled At" moduleKey="disabledAt" type='datetime' control={control} />
                        <ScoutModule text="Is Hanging" moduleKey="isHanging" type='checkbox' control={control} />
                        <ScoutModule className="pl-4" text="Trap" moduleKey="trap" type='number' control={control} rules={{ validate: validateNonNegative }} />
                        <ScoutModule text="Spot Light" moduleKey="spotLight" type='checkbox' control={control} />
                        <ScoutCommentModule text="Comments" moduleKey="teleopcomments" control={control} />
                    </div>
                </div>
                <div className='pb-4'>
                    <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Misc</h1>
                    <div className="grid grid-cols-2 grid-rows-2 text-3xl font-thin">
                        <ScoutModule text="Defense" moduleKey="defense" type='dropdown' items={[
                            { key: '0', value: 'Did Not Play Defense' },
                            { key: '1', value: 'Poor' },
                            { key: '2', value: 'Fair' },
                            { key: '3', value: 'Good' },
                            { key: '4', value: 'Excellent' },
                        ]} control={control} />
                        <ScoutModule text="Reliability" moduleKey="reliability" type='dropdown' items={[
                            { key: '1', value: '1 - Dropped Many Notes, Unstable Cycle Times' },
                            { key: '2', value: '2 - Some Drops, Inconsistent Cycle Times' },
                            { key: '3', value: '3 - Few Drops, Fairly Consistent Cycle Times' },
                            { key: '4', value: '4 - Rare Drops, Consistent Cycle Times' },
                            { key: '5', value: '5 - No Drops, Consistent Cycle Times' }
                        ]} control={control} />
                        <ScoutCommentModule text="Comments" moduleKey="misccomments" control={control} />
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