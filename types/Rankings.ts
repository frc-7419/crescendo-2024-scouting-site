interface Record {
    losses: number;
    wins: number;
    ties: number;
}

interface Ranking {
    matches_played: number;
    qual_average: number;
    extra_stats: number[];
    sort_orders: number[];
    record: Record;
    rank: number;
    dq: number;
    team_key: string;
}

interface ExtraStatsInfo {
    precision: number;
    name: string;
}

interface SortOrderInfo {
    precision: number;
    name: string;
}

export interface RankingsData {
    rankings: Ranking[];
    extra_stats_info: ExtraStatsInfo[];
    sort_order_info: SortOrderInfo[];
}
