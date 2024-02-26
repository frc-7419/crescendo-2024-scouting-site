import {TeamRole, User} from "@prisma/client";

interface ScoutingSchedule {
    id?: number;
    matchNumber: number;
    matchID: string;
    venue: string;
    scouters: Scouter[];
}

interface Scouter {
    id?: number;
    scouter?: User;
    scouterId: string;
    role: TeamRole;
    ScoutingSchedule?: ScoutingSchedule;
    scoutingScheduleId?: number;
}

export type {ScoutingSchedule, Scouter};