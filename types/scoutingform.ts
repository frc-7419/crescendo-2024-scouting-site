type Alliance = 'RED' | 'BLUE';

type FinalStatus = 'PARKED' | 'ONSTAGE' | 'ONSTAGE_SPOTLIT';

type PickupFrom = 'FLOOR' | 'SOURCE' | 'BOTH' | 'NOT_ATTEMPTED';

type IntakePosition = 'OTB' | 'UTB';

type Auton = {
    id: number;
    preload: boolean;
    leftCommunity: boolean;
    speaker: number;
    amp: number;
    comments: string;
};

type Teleop = {
    id: number;
    defensive: boolean;
    intake: IntakePosition;
    amp: number;
    speaker: number;
    timesAmped: number;
    pickupFrom: PickupFrom;
    isDisabled: boolean;
    disabledAt: Date | null;
    isHanging: boolean;
    trap: number;
    spotLight: boolean;
    comments: string;
    finalStatus: FinalStatus;
};

type Misc = {
    id: number;
    defense: number;
    reliability: number;
    comments: string;
};

type ScoutingData = {
    id: number;
    matchNumber: number;
    teamNumber: number;
    venue: string;
    submitTime: Date;
    auton: Auton;
    teleop: Teleop;
    misc: Misc;
    autonId: number;
    teleopId: number;
    miscId: number;
    robot: {
        teamNumber: number;
    };
    scouter: {
        id: string;
    };
};