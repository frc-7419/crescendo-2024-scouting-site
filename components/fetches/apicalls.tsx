import Axios from "axios";
import {buildMemoryStorage, buildWebStorage, setupCache} from "axios-cache-interceptor";

const instance = Axios.create();
const storage = typeof window !== 'undefined' ? buildWebStorage(localStorage, 'axios-cache:') : buildMemoryStorage();

const axios = setupCache(instance, {
    storage: storage
});

export async function getMatches(eventKey: string) {
    const response = await axios.get(`/api/bluealliance/getMatches/${eventKey}`, {
        cache: {
            ttl: 120
        }
    });
    console.debug("is response cached: ", response.cached)
    console.debug(response.data);
    return response.data;
}

export async function getShifts() {
    const response = await axios.get(`/api/schedule/user/get`, {
        cache: {
            ttl: 30
        }
    });

    const data = await response.data;
    console.debug(data);
    return (data)
}

export async function getEvent(eventKey: string) {
    const response = await axios.get(`/api/bluealliance/getEventInfo/${eventKey}`, {
        cache: {
            ttl: 60 * 10
        }
    });
    const data = await response.data;
    console.debug(data);
    return (data)
}

export async function getFormData(match: string) {
    const res = await axios.get(`/api/schedule/user/get/form?matchId=${match}`, {
        cache: {
            ttl: 30
        }
    });
    const data = res.data;
    console.debug(data);
    return (data)
}

export async function getSchedule(venue: string) {
    const res = await axios.get(`/api/schedule/get?venue=${venue}`, {
        cache: {
            ttl: 60
        }
    })
    const data = res.data;
    console.debug(data)
    return (data)
}

export async function getUsers() {
    const response = await axios.get('/api/users/getusers', {
        cache: {
            ttl: 60 * 10
        }
    });
    const data = await response.data;
    // Store the fetched users
    return data.map((user: { name: string, id: string, email: string }) => ({
        name: user.name,
        uuid: user.id,
        email: user.email
    }))
}

export async function getRobotData(robotNumber: string) {
    const res = await axios.get(`/api/data/robot/${robotNumber}`, {
        cache: {
            ttl: 60
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}

export async function getTeamBlueAllianceData(team: string, season: string) {
    const res = await axios.get(`/api/bluealliance/getTeamInfo/${team}?season=${season}`, {
        cache: {
            ttl: 60 * 60 * 3
        }
    })

    const data = await res.data;
    console.debug(data)
    return data;
}

export async function getBasicTeamBlueAllianceData(team: string) {
    const res = await axios.get(`/api/bluealliance/getTeamInfo/basic/${team}`, {
        cache: {
            ttl: 60 * 60 * 3
        }
    })

    const data = await res.data;
    console.debug(data)
    return data;
}

export async function getRobotAverages(robotNumber: string) {
    const res = await axios.get(`/api/data/robot/${robotNumber}?type=avg`, {
        cache: {
            ttl: 60
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}

export async function getRobotBest(robotNumber: string) {
    const res = await axios.get(`/api/data/robot/${robotNumber}?type=best`, {
        cache: {
            ttl: 60
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}

export async function getAverages(venue: string) {
    const res = await axios.get(`/api/data/averages?venue=${venue}`, {
        cache: {
            ttl: 30
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}

export async function getBests(venue: string) {
    const res = await axios.get(`/api/data/bests?venue=${venue}`, {
        cache: {
            ttl: 30
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}

export async function getTopTeamsCont(venue: string) {
    const res = await axios.get(`/api/data/topTeams?venue=${venue}`, {
        cache: {
            ttl: 60
        }
    })
    const data = await res.data;
    console.debug(data)
    return (data)
}