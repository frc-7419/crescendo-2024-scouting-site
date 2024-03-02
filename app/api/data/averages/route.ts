import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

async function getAll(venue: string) {
    const averages = await prisma.averages.findMany({
        where: {venue},
    })

    const sortedAverages = averages.sort((a, b) => {
        const sumA = a.avgampauton + a.avgspeakerauton + a.avgampteleop + a.avgspeakerteleop;
        const sumB = b.avgampauton + b.avgspeakerauton + b.avgampteleop + b.avgspeakerteleop;
        return sumB - sumA;
    });
    const data = sortedAverages.map((item, index) => ({
        ...item,
        ranking: index + 1
    }));
    const responseBody = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length.toString(),
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}


export async function GET(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams
    const venue = searchParams.get('venue') as string;

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }


    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
        return await getAll(venue);
    } catch (error) {
        console.error('Error retrieving scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}