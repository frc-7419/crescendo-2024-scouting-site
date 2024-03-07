import {ScoutingData} from "@/types/scoutingform";

export default interface TeamData {
    id: number;
    teamNumber: string;
    winloss: number;
    scoutingData: ScoutingData[];
}