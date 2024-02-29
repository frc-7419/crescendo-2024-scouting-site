import {ScoutingData} from "@prisma/client";

interface TeamData {
    id: number;
    teamNumber: string;
    winloss: number;
    scoutingData: ScoutingData[]
}