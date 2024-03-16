interface ContinuousAverage {
    continuousAverage: number;
    percentChange: number;
    match: number;
}

export interface TickerData {
    teamNumber: string;
    continuousAverage: ContinuousAverage[];
}