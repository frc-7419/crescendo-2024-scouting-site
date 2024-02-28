import Axios from "axios";
import { buildWebStorage, setupCache } from "axios-cache-interceptor";

const instance = Axios.create();
const axios = setupCache(instance, {
    // storage: buildWebStorage(sessionStorage, 'axios-cache:')
});

export async function getMatches(eventKey: string) {
    try {
        const response = await axios.get(`/api/bluealliance/getMatches/${eventKey}`, {
            cache: {
                ttl: 120
            }
        });
        console.debug("is response cached: ", response.cached)
        console.debug(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
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

