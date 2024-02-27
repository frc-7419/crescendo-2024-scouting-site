import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ScoutingSchedule from "@/lib/schemas";
import {ScoutingSchedule as ScoutingScheduleInterface} from "@/types/schedule";

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
        const venue = json.venue;

        const scheduleIds = await prisma.scoutingSchedule.findMany({
            where: {
                venue: venue,
            },
            select: {
                id: true,
            },
        });

        const scheduleIdsArray = scheduleIds.map((schedule) => schedule.id);

        await prisma.scouter.deleteMany({
            where: {
                scoutingScheduleId: {
                    in: scheduleIdsArray,
                },
            },
        });

        await prisma.scoutingSchedule.deleteMany({
            where: {
                venue: venue,
            },
        });


        if (json.entries) {
            let fullRequest = {};
            const matches = Object.values(json.entries);

            for (const match of matches) {
                const response = ScoutingSchedule.safeParse(match);

                if (!response.success) {
                    const {errors} = response.error;

                    return new Response(`Invalid ${errors}`, {
                        status: 400,
                    });
                }

                const parsedMatch = response.data;
                parsedMatch.venue = venue;

                await prisma.scoutingSchedule.create({
                    data: {
                        matchNumber: parsedMatch.matchNumber,
                        matchID: parsedMatch.matchID,
                        venue: parsedMatch.venue,
                        scouters: {
                            create: parsedMatch.scouters.map((scouter: ScoutingScheduleInterface["scouters"][0]) => {
                                return {
                                    scouterId: scouter.scouterId,
                                    role: scouter.role
                                };
                            }),
                        }
                    }
                });
            }
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