import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

async function getAll(venue: string) {
    const bests = await prisma.bests.findMany({
        where: {venue},
        cacheStrategy: {
            ttl: 60,
        },
    })

    const sortedbests = bests.sort((a, b) => {
        const sumA = a.ampauton + a.speakerauton + a.ampteleop + a.speakerteleop;
        const sumB = b.ampauton + b.speakerauton + b.ampteleop + b.speakerteleop;
        return sumB - sumA;
    });
    const data = sortedbests.map((item, index) => ({
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