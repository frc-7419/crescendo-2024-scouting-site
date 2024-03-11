import {ScoutingFormData} from '@/types/form';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    Textarea,
    useDisclosure
} from '@nextui-org/react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Controller, FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {ReturnedFormData, ScoutingData} from '@/types/scoutingform';
import {LoadStatusContext} from '../loading/LoadStatusContext';
import toast from 'react-hot-toast';
import SuccessAnim from '@/resources/Success.json';
import {useRouter} from 'next/navigation';

const ScoutingForm = ({formData}: { formData: ScoutingFormData }) => {
    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [submittingForm, setSubmittingForm] = useState<boolean>(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {control, handleSubmit, formState: {errors}} = useForm();
    const router = useRouter();
    const [formSuccess, setFormSuccess] = useState(false);

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
                            render={({field}) => <Checkbox {...field} checked={field.value} color="primary"/>}
                            shouldUnregister={false}
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
                            render={({field}) => (
                                <Input
                                    {...field}
                                    placeholder="0"
                                    defaultValue='0'
                                    min="0"
                                    className="w-25"
                                    variant="bordered"
                                    type="number"
                                    isInvalid={!!errors[moduleKey]}
                                    errorMessage={errors[moduleKey]?.message as String}
                                />
                            )}
                            shouldUnregister={false}
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
                            render={({field}) => (
                                <Autocomplete
                                    label={text}
                                    isRequired
                                    className="max-w-xs"
                                    key={moduleKey}
                                    value={field.value}
                                    onSelectionChange={(value) => field.onChange(value)}
                                >
                                    {items?.map(({key: itemKey, value: itemValue}) => (
                                        <AutocompleteItem key={itemKey} value={itemValue}>
                                            {itemValue}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            )}
                            shouldUnregister={false}
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
                            render={({field}) => (
                                <Input {...field} className="w-25" variant="bordered" type="text" defaultValue='00:00'
                                       pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$"/>
                            )}
                            shouldUnregister={false}
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
                            render={({field}) => (
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
                            shouldUnregister={false}
                            rules={rules}
                        />
                    </>
                )}
            </div>
        );
    };

    const ScoutCommentModule = ({text, moduleKey, control}: {
        text: string;
        moduleKey: string;
        control: any;
        rules?: any;
    }) => {
        return (
            <div className='pt-4 pb-4 col-start-1 col-end-3'>
                <p className='pb-4'>{text}</p>
                <Controller
                    name={moduleKey}
                    control={control}
                    render={({field}) => (
                        <Textarea {...field} variant="faded" key={moduleKey} color='primary'/>
                    )}
                    shouldUnregister={false}
                />
            </div>
        )
    }

    const onSubmit: SubmitHandler<FieldValues> = (data, event) => {
        event?.preventDefault();
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
            })
            .finally(() => {
                setSubmittingForm(false);
            });
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
            <div className="bg-red-700 max-w-full p-6 rounded-lg mb-6">
                Please double check your data before submitting. Form will reset if invalid. We cannot fix that issue.
            </div>
            <div className="bg-amber-700 max-w-full p-6 rounded-lg mb-6">
                Your changes will NOT be saved if you leave this page.
            </div>
            <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='pb-4'>
                        <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Auton</h1>
                        <div className="grid grid-cols-2 grid-rows-3 text-3xl font-thin gap-4 scoutformentry">
                            <ScoutModule text="Has Preload" moduleKey="preload" type='checkbox' control={control}/>
                            <ScoutModule text="Left Community" moduleKey="leftCommunity" type='checkbox'
                                         control={control}/>
                            <ScoutModule text="Speaker" moduleKey="autospeaker" type='number' control={control}
                            />
                            <ScoutModule text="Amp" moduleKey="autoamp" type='number' control={control}
                            />
                            <ScoutCommentModule text="Comments" moduleKey="autocomments" control={control}/>
                        </div>
                    </div>
                    <div className='pb-4'>
                        <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Teleop</h1>
                        <div className="grid grid-cols-2 grid-rows-7 text-3xl font-thin gap-4 scoutformentry">
                            <ScoutModule text="Defensive" moduleKey="defensive" type='checkbox' control={control}/>
                            <ScoutModule text="Intake" moduleKey="intake" type='dropdown' items={
                                [
                                    {key: 'OTB', value: 'Over the Bumper'},
                                    {key: 'UTB', value: 'Under the Bumper'},]
                            } control={control}/>
                            <ScoutModule text="Amp" moduleKey="teleopamp" type='number' control={control}
                            />
                            <ScoutModule text="Speaker" moduleKey="teleopspeaker" type='number' control={control}
                            />
                            <ScoutModule text="Times Amped" moduleKey="timesAmped" type='number' control={control}
                            />
                            <ScoutModule text="Pickup From" moduleKey="pickupFrom" type='dropdown' items={[
                                {key: 'FLOOR', value: 'Floor'},
                                {key: 'SOURCE', value: 'Source'},
                                {key: 'BOTH', value: 'Both'},
                                {key: 'NOT_ATTEMPTED', value: 'Did Not Attempt'},
                            ]} control={control}/>
                            <ScoutModule text="Is Disabled" moduleKey="isRobotDisabled" type='checkbox'
                                         control={control}/>
                            <ScoutModule text="Disabled At" moduleKey="disabledAt" type='datetime' control={control}/>
                            <ScoutModule text="Is Hanging" moduleKey="isHanging" type='checkbox' control={control}/>
                            <ScoutModule text="Trap" moduleKey="trap" type='number' control={control}
                            />
                            <ScoutModule text="Spot Light" moduleKey="spotLight" type='checkbox' control={control}/>
                            <ScoutCommentModule text="Comments" moduleKey="teleopcomments" control={control}/>
                        </div>
                    </div>
                    <div className='pb-4'>
                        <h1 className={`text-4xl font-thin border-b-1 pb-1 ${formData.alliance === 'BLUE' ? 'border-blue-600' : 'border-red-600'}`}>Misc</h1>
                        <div className="grid grid-cols-2 grid-rows-2 text-3xl font-thin gap-4 scoutformentry">
                            <ScoutModule text="Defense" moduleKey="defense" type='dropdown' items={[
                                {key: '0', value: 'Did Not Play Defense'},
                                {key: '1', value: 'Poor'},
                                {key: '2', value: 'Fair'},
                                {key: '3', value: 'Good'},
                                {key: '4', value: 'Excellent'},
                            ]} control={control}/>
                            <ScoutModule text="Reliability" moduleKey="reliability" type='dropdown' items={[
                                {key: '1', value: '1 - Dropped Many Notes, Unstable Cycle Times'},
                                {key: '2', value: '2 - Some Drops, Inconsistent Cycle Times'},
                                {key: '3', value: '3 - Few Drops, Fairly Consistent Cycle Times'},
                                {key: '4', value: '4 - Rare Drops, Consistent Cycle Times'},
                                {key: '5', value: '5 - No Drops, Consistent Cycle Times'}
                            ]} control={control}/>
                            <ScoutCommentModule text="Comments" moduleKey="misccomments" control={control}/>
                        </div>
                    </div>
                    <Button fullWidth color="primary" size="lg" variant="shadow" type='submit'
                            isLoading={submittingForm}>
                        Submit
                    </Button>
                </form>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}
                   hideCloseButton>
                <ModalContent>
                    {() => (
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