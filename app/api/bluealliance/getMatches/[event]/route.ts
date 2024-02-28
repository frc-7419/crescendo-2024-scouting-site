import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import {Match} from "@/types/match";

export async function GET(
    request: Request,
    {params}: { params: { event: string } }
) {
    const session = await getServerSession(authOptions)
    const event = params.event

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${event}/matches/simple`, {
            headers: new Headers({
                'X-TBA-Auth-Key': process.env.BLUEALLIANCE_API_KEY || ''
            }),
            next: {revalidate: 30}
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        data.forEach((match: Match) => {
            if (!match.predicted_time) {
                match.predicted_time = match.time;
            }
        }); // Kinda scuffed but useful for Offseason events
        const sortedMatches = data.sort((a: Match, b: Match) => a.predicted_time - b.predicted_time);

        const responseBody = JSON.stringify(sortedMatches);
        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString(),
        };

        return new Response(responseBody, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        })
    }
}