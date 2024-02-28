'use client';

import Axios from "axios";
import {setupCache} from "axios-cache-interceptor";

const instance = Axios.create();
const axios = setupCache(instance, {
    // storage: buildWebStorage(localStorage, 'axios-cache:')
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
    try {
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
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}