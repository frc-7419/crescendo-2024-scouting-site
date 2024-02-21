import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Match } from "@/types/match";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { team: string } }
) {
    const session = await getServerSession(authOptions)
    const team = params.team

    const searchParams = request.nextUrl.searchParams
    const selectedSeason = searchParams.get('season') as string;

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${team}`, {
            headers: new Headers({
                'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
            })
        });
        const teamResponse = await response.json();
        console.log('Team Data:', teamResponse);

        const eventsResponse = await fetch(`https://www.thebluealliance.com/api/v3/team/${team}/events/${selectedSeason}`, {
            headers: new Headers({
                'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
            })
        }).then(response => response.json());
        console.log('Team Events:', eventsResponse);
        eventsResponse.sort((a: { week: number; }, b: { week: number; }) => a.week - b.week);
        return new Response(JSON.stringify({ teamResponse, eventsResponse }), {
            status: 200,
        })
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        })
    }
}