import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

        const {
            matchNumber,
            matchID,
            teamNumber,
            venue,
            submitTime,
            auton,
            teleop,
            misc,
            scouterId,
        } = json;

        await prisma.scoutingData.create({
            data: {
                matchNumber: Number(matchNumber),
                matchID: matchID,
                venue,
                submitTime,
                auton: {
                    create: {
                        preload: auton.preload,
                        leftCommunity: auton.leftCommunity,
                        speaker: Number(auton.speaker),
                        amp: Number(auton.amp),
                        comments: auton.comments,
                    },
                },
                teleop: {
                    create: {
                        defensive: teleop.defensive,
                        intake: teleop.intake,
                        amp: Number(teleop.amp),
                        speaker: Number(teleop.speaker),
                        timesAmped: Number(teleop.timesAmped),
                        pickupFrom: teleop.pickupFrom,
                        isRobotDisabled: teleop.isRobotDisabled,
                        disabledAt: teleop.disabledAt,
                        isHanging: teleop.isHanging,
                        trap: Number(teleop.trap),
                        spotLight: teleop.spotLight,
                        comments: teleop.comments,
                        finalStatus: teleop.finalStatus,
                    },
                },
                misc: {
                    create: {
                        defense: Number(misc.defense),
                        reliability: Number(misc.reliability),
                        comments: misc.comments,
                    },
                },
                scouter: {
                    connect: {
                        id: scouterId
                    }
                },
                robot: {
                    connectOrCreate: {
                        where: { teamNumber: Number(teamNumber) },
                        create: { teamNumber: Number(teamNumber) }
                    }
                },
            },
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
