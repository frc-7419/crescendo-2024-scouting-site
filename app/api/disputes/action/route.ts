import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import {NextRequest} from "next/server";

async function deleteEntry(id: number) {
    await prisma.scheduleDisputes.delete({
        where: {
            id: id,
        },
    });
}

async function acceptDispute(id: number) {
    const dispute = await prisma.scheduleDisputes.findUnique({
        where: {
            id: id,
        }
    });

    if (!dispute) {
        throw new Error("Dispute not found");
    }

    const match = await prisma.scoutingSchedule.findUnique({
        where: {
            matchID: dispute.matchID,
        },
        include: {
            scouters: true,
        }
    });

    if (!match) {
        throw new Error("Match not found");
    }

    const constantScouterToId: string = dispute.toScouterId || "";

    if (!constantScouterToId) {
        throw new Error("toScouterId not found");
    }

    // Find the index of the scouter with the given scouterId
    const scouterIndex = match.scouters.findIndex(scouter => scouter.scouterId === dispute.scouterId);

    if (scouterIndex !== -1) {
        // Update the scouterId to the new value
        match.scouters[scouterIndex].scouterId = constantScouterToId;

        // Save the updated match object
        await prisma.scoutingSchedule.update({
            where: {
                matchID: dispute.matchID,
            },
            data: {
                scouters: {
                    updateMany: {
                        where: {
                            scouterId: dispute.scouterId,
                        },
                        data: {
                            scouterId: constantScouterToId
                        }
                    }
                },
            },
        });

        await prisma.scheduleDisputes.delete({
            where: {
                id: id,
            },
        });
        console.log("Scouter updated successfully.");
    } else {
        console.log("Scouter with the given scouterId not found.");
    }
}


export async function POST(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions)

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') as string;

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

        if (action === "delete") {
            await deleteEntry(json.id);
        } else if (action === "accept") {
            await acceptDispute(json.id);
        }

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