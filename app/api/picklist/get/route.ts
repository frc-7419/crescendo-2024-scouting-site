import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

async function getPicklist(venue: string) {
    const picklist = await prisma.picklist.findMany({
        where: {
            venue: venue
        },
        cacheStrategy: {
            ttl: 10
        }
    })

    const sortedPicklist = picklist.sort((a, b) => {
        return a.position - b.position;
    });

    const responseBody = JSON.stringify(sortedPicklist);
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
        return await getPicklist(venue);
    } catch (error) {
        console.error('Error retrieving scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}