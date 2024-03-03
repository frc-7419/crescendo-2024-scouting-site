import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";
import {getCurrentEvent} from "@/components/getCurrentEvent";

async function getAll(teamNumber: string) {
    const scoutingData = await prisma.robot.findUnique({
        where: {teamNumber},
        include: {scoutingData: {include: {auton: true, teleop: true, misc: true}}},
    });

    if (!scoutingData) {
        return new Response('Scouting data not found for the specified robot', {
            status: 404,
        });
    }

    const responseBody = JSON.stringify(scoutingData);
    const headers = {
        'Content-Type': 'application/json',
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}

async function getAvg(teamNumber: string) {
    const scoutingData = await prisma.averages.findFirst({
        where: {
            teamNumber,
            venue: getCurrentEvent()
        }
    })

    if (!scoutingData) {
        return new Response('Scouting data not found for the specified robot', {
            status: 404,
        });
    }

    const responseBody = JSON.stringify(scoutingData)

    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length.toString(),
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}

async function getBest(teamNumber: string) {
    const scoutingData = await prisma.bests.findFirst({
        where: {
            teamNumber,
            venue: getCurrentEvent()
        }
    })

    if (!scoutingData) {
        return new Response('Scouting data not found for the specified robot', {
            status: 404,
        });
    }

    const responseBody = JSON.stringify(scoutingData)

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
    {params}: { params: { robot: string } }
) {
    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as string;

    const teamNumber = params.robot

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
        if (type === 'avg') {
            return await getAvg(teamNumber);
        } else if (type == 'best') {
            return await getBest(teamNumber);
        } else {
            return await getAll(teamNumber);
        }
    } catch (error) {
        console.error('Error retrieving scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}