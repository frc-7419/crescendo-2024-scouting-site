import {FieldValues} from 'react-hook-form';

type Alliance = 'RED' | 'BLUE';

type FinalStatus = 'PARKED' | 'ONSTAGE' | 'ONSTAGE_SPOTLIT';

type PickupFrom = 'FLOOR' | 'SOURCE' | 'BOTH' | 'NOT_ATTEMPTED';

type IntakePosition = 'OTB' | 'UTB';

type Auton = {
    id?: number;
    preload: boolean;
    leftCommunity: boolean;
    speaker: number;
    amp: number;
    comments: string;
};

type Teleop = {
    id?: number;
    defensive: boolean;
    intake: IntakePosition;
    amp: number;
    speaker: number;
    timesAmped: number;
    pickupFrom: PickupFrom;
    isRobotDisabled: boolean;
    disabledAt: number;
    isHanging: boolean;
    trap: number;
    spotLight: boolean;
    comments: string;
    finalStatus: FinalStatus;
};

type Misc = {
    id?: number;
    defense: number;
    reliability: number;
    comments: string;
};

export interface ScoutingData {
    id?: number;
    matchNumber: number;
    matchID: string;
    teamNumber: string;
    venue: string;
    submitTime: Date;
    auton: Auton;
    teleop: Teleop;
    misc: Misc;
    autonId?: number;
    teleopId?: number;
    miscId?: number;
    scouterId: string;
}

export interface ReturnedFormData extends FieldValues {
    preload: boolean;
    leftCommunity: boolean;
    autospeaker: number;
    autoamp: number;
    autocomments: string;
    defensive: boolean;
    intake: IntakePosition;
    teleopamp: number;
    teleopspeaker: number;
    timesAmped: number;
    pickupFrom: PickupFrom;
    isRobotDisabled: boolean;
    disabledAt: string;
    isHanging: boolean;
    trap: number;
    spotLight: boolean;
    teleopcomments: string;
    defense: number;
    reliability: number;
    misccomments: string;
}

export interface ScoutingDataAvg {
    avgampauton: number;
    avgspeakerauton: number;
    avgampteleop: number;
    avgspeakerteleop: number;
    avgtimesamped: number;
    avgtrap: number;
    avgdefense: number;
    avgreliability: number;
}