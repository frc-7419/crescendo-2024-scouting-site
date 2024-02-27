import {User} from "@prisma/client";

export interface Dispute {
    matchID: string;
    scouter: User;
    scouterId: string;
    toScouter: User;
    toScouterId: string;
    reason: string;
    id: number;
}