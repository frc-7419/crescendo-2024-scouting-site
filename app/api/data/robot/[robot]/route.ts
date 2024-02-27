import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    {params}: { params: { robot: string } }
) {
    const session = await getServerSession(authOptions);

    const teamNumber = params.robot

    /*
    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }
    */

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
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
            'Content-Length': responseBody.length.toString(),
        };

        return new Response(responseBody, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error('Error retrieving scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }


}