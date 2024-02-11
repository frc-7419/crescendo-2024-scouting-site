import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { type NextRequest } from 'next/server'
import prisma from "@/lib/prisma";
import { TeamRole } from "@prisma/client";

export async function GET(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    const schedules = await prisma.scouter.findMany({
        where: {
            scouterId: session?.user?.id,
            // scouterId: '94af928c-26ae-42e1-9ecb-e0428cfcd9f1'
        },
        include: {
            ScoutingSchedule: true,
        },
    });

    return new Response(JSON.stringify(schedules), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}