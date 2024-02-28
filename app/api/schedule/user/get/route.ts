import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

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

    const responseBody = JSON.stringify(schedules);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length.toString(),
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}