// @/types/Event.ts

export interface Event {
    key: string;
    name: string;
    event_code: string;
    event_type_string: string;
    year: number;
    district?: District_List;
    city?: string;
    state_prov?: string;
    country?: string;
    start_date?: string;
    end_date?: string;
    short_name?: string;
    week?: number;
    address?: string;
    postal_code?: string;
    gmaps_place_id?: string;
    gmaps_url?: string;
    lat?: number;
    lng?: number;
    location_name?: string;
    timezone?: string;
    website?: string;
    first_event_id?: string;
    first_event_code?: string;
    webcasts?: any[];
    division_keys?: string[];
    parent_event_key?: string;
    playoff_type?: number;
    playoff_type_string?: string;
}

interface District_List {
    abbreviation: string;
    display_name: string;
    key: string;
    year: number;
}