import { ScoutingFormData } from '@/types/form';
import { Autocomplete, AutocompleteItem, Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react';
import React, { FormEvent, use, useContext, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useController, useForm, useWatch } from 'react-hook-form';
import { ReturnedFormData, ScoutingData } from '@/types/scoutingform';
import { FieldValues } from 'react-hook-form';
import { LoadStatusContext } from './LoadStatusContext';
import toast from 'react-hot-toast';
import SuccessAnim from '@/resources/Success.json';
import { useRouter } from 'next/navigation';

const ScoutingForm = ({ formData }: { formData: ScoutingFormData }) => {
    const { value, setValue } = useContext(LoadStatusContext) as { value: number; setValue: React.Dispatch<React.SetStateAction<number>> };
    const [submittingForm, setSubmittingForm] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { control, handleSubmit, formState: { errors }, getValues } = useForm();
    const router = useRouter();
    const [formSuccess, setFormSuccess] = useState(false);

    const validateNonNegative = (value: number) => {
        return value === undefined || value > 0 || 'Value must be non-negative';
    };
    const aRef = useRef<HTMLDivElement>(null);

    const loadAnimation = () => {
        if (typeof window !== 'undefined') {
            import('lottie-web').then((lottie) => {
                lottie.default.loadAnimation({
                    container: aRef.current!,
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    animationData: SuccessAnim,
                });
            });
        }
    }

    function mapReturnedFormDataToFullFormData(data: ReturnedFormData): ScoutingData {
        return {
            matchNumber: Number(formData.matchNumber),
            matchID: formData.matchId,
            teamNumber: formData.team,
            venue: formData.venue,
            submitTime: new Date(),
            auton: {
                preload: data.preload ?? false,
                leftCommunity: data.leftCommunity ?? false,
                speaker: Number(data.autospeaker) ?? 0,
                amp: Number(data.autoamp) ?? 0,
                comments: data.autocomments ?? '',
            },
            teleop: {
                defensive: data.defensive ?? false,
                intake: data.intake,
                amp: Number(data.teleopamp) ?? 0,
                speaker: Number(data.teleopspeaker) ?? 0,
                timesAmped: Number(data.timesAmped) ?? 0,
                pickupFrom: data.pickupFrom,
                isRobotDisabled: data.isRobotDisabled ?? false,
                disabledAt: data.disabledAt ? data.disabledAt.split(':').reduce((acc, val) => acc * 60 + parseInt(val), 0) : 0,
                isHanging: data.isHanging ?? false,
                trap: Number(data.trap) ?? 0,
                spotLight: data.spotLight ?? false,
                comments: data.teleopcomments ?? '',
                finalStatus: data.isHanging ? (data.isHanging && data.spotLight ? 'ONSTAGE_SPOTLIT' : 'ONSTAGE') : 'PARKED'
            },
            misc: {
                defense: Number(data.defense),
                reliability: Number(data.reliability),
                comments: data.misccomments ?? ''
            },
            scouterId: formData.scouterId
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
                                    defaultValue='0'
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
        setValue(0);
        setSubmittingForm(true);
        console.debug("Starting Submit")
        const dataBody = mapReturnedFormDataToFullFormData(data as ReturnedFormData);
        console.debug(dataBody);
        fetch('/api/scoutingForm/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        })
            .then(response => {
                if (response.ok) {
                    toast.success('Data pushed successfully');
                    onOpen();
                    setValue(100);
                    setFormSuccess(true);
                } else {
                    toast.error('Failed to push data');
                    setValue(500);
                }
            })
            .catch(error => {
                setValue(500);
                toast.error('Error occurred while pushing data:', error);
            });
        setSubmittingForm(false);
    }

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (formSuccess) {
            loadAnimation();
            timeoutId = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timeoutId);
        };
    }, [formSuccess]);

    useEffect(() => {
        if (countdown === 0) {
            router.push('/dashboard');
        }
    }, [countdown, router]);

    return (
        <>
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
                    <Button fullWidth color="primary" size="lg" variant="shadow" type='submit' isLoading={submittingForm}>
                        Submit
                    </Button>
                </form >
            </div >
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className={'flex flex-col align-middle text-center pb-4 px-2'}>
                                <div ref={aRef}></div>
                                <div className="text-3xl">Success!</div>
                                <p className="text-xl">Redirecting in {countdown} seconds...</p>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ScoutingForm;