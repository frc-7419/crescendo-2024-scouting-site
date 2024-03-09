import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import {NextRequest} from "next/server";
import env from "@/config/env";


export async function GET(
    request: NextRequest,
    {params}: { params: { team: string } }
) {
    const session = await getServerSession(authOptions)
    const team = params.team

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}`, {
            headers: new Headers({
                'X-TBA-Auth-Key': env.BLUEALLIANCE_API_KEY || ''
            }),
            next: {revalidate: 3600}
        });
        const teamResponse = await response.json();

        const responseBody = JSON.stringify(teamResponse);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString(),
            'Cache-Control': 'public, s-maxage=3600',
            'CDN-Cache-Control': 'public, s-maxage=7200',
            'Vercel-CDN-Cache-Control': 'public, s-maxage=14400',
        });
        return new Response(responseBody, {
            status: 200,
            headers: headers
        });
    } catch (error) {
        return new Response(String(error), {
            status: 500,
        })
    }
}