import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";
import {TeamRole} from "@prisma/client";

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

    if (!venue) return new Response("Invalid Venue", {
        status: 400,
    });

    const schedules = await prisma.scoutingSchedule.findMany({
        where: {
            venue: venue,
        },
        include: {
            scouters: true,
        },
    });

    const output: {
        venue: string,
        entries: {
            matchNumber: number;
            matchID: string;
            venue: string;
            scouters: { scouterId: string; role: TeamRole }[]
        }[]
    } = {
        venue: "",
        entries: [],
    };

    output.venue = venue;
    for (const schedule of schedules) {
        const {id, matchNumber, matchID, scouters} = schedule;
        const sortedScouters = scouters.sort((a, b) => {
            const roleOrder = {
                "BLUEONE": 1,
                "BLUETWO": 2,
                "BLUETHREE": 3,
                "REDONE": 4,
                "REDTWO": 5,
                "REDTHREE": 6
            };
            return roleOrder[a.role] - roleOrder[b.role];
        });

        const scouterData = sortedScouters.map((scouter) => {
            return {
                scouterId: scouter.scouterId,
                role: scouter.role,
            };
        });

        output.entries.push({
            matchNumber: matchNumber,
            matchID: matchID,
            venue: venue,
            scouters: scouterData,
        });
    }

    const responseBody = JSON.stringify(output);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length.toString(),
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}