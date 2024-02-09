export interface Match {
    actual_time: number;
    alliances: {
      blue: {
        dq_team_keys: string[];
        score: number;
        surrogate_team_keys: string[];
        team_keys: string[];
        scouters: string[];
      };
      red: {
        dq_team_keys: string[];
        score: number;
        surrogate_team_keys: string[];
        team_keys: string[];
        scouters: string[];
      };
    };
    comp_level: string;
    event_key: string;
    key: string;
    match_number: number;
    predicted_time: number;
    set_number: number;
    time: number;
    winning_alliance: 'blue' | 'red';
}