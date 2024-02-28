import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import prisma from "@/lib/prisma";

export async function POST(
    request: Request,
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "POST") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const json = await request.json();
        const reason = json.reason;
        const matchId = json.matchId;
        const disputeUser = json.disputeUser;

        const dispute = await prisma.scheduleDisputes.create({
            data: {
                matchID: matchId,
                reason: reason,
                scouter: {
                    connect: {
                        id: session?.user?.id,
                    },
                },
                toScouter: {
                    connect: {
                        id: disputeUser,
                    },
                },
            }
        });

        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        });
    }
}