import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const dispute = await prisma.scheduleDisputes.findMany({
            where: {
                toScouterId: session?.user?.id,
            },
            include: {
                scouter: true
            },
            cacheStrategy: {
                ttl: 30,
            },
        });

        const responseBody = JSON.stringify(dispute);
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
        });
    }
}