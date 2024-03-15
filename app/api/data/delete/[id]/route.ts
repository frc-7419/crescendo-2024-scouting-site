import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {getAverages, getBests} from "@/components/fetches/sqlStatements";
import {IntakePosition, PickupFrom, ScoutingDataAvg, ScoutingDataBest} from "@/types/scoutingform";
import {PrismaClient} from "@prisma/client";
import env from "@/config/env";

const prisma = new PrismaClient({
    datasourceUrl: env.DIRECT_URL
});

export async function POST(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    const id = params.id

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }

    if (request.method !== "POST") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
        const del = await prisma.scoutingData.delete({
            where: {
                id: parseInt(id)
            }
        })

        const robot = del.teamNumber;
        const venue = getCurrentEvent()
        const scoutingDataPull = await prisma.$queryRaw(getAverages(robot, getCurrentEvent())) as any
        const scoutingDataAvg: ScoutingDataAvg = scoutingDataPull[0];
        const avgID = await prisma.averages.findFirst({
            where: {
                teamNumber: robot,
                venue
            },
            select: {
                id: true
            }
        });
        if (scoutingDataAvg && avgID) {
            await prisma.averages.update({
                where: {
                    id: avgID.id
                },
                data: {
                    teamNumber: robot,
                    venue: venue,
                    intake: scoutingDataAvg.intake as IntakePosition,
                    avgampauton: scoutingDataAvg.avgampauton,
                    avgspeakerauton: scoutingDataAvg.avgspeakerauton,
                    avgampteleop: scoutingDataAvg.avgampteleop,
                    avgspeakerteleop: scoutingDataAvg.avgspeakerteleop,
                    avgtimesamped: scoutingDataAvg.avgtimesamped,
                    avgtrap: scoutingDataAvg.avgtrap,
                    avgdefense: scoutingDataAvg.avgdefense,
                    avgreliability: scoutingDataAvg.avgreliability,
                    hang: scoutingDataAvg.hang,
                    pickup: scoutingDataAvg.pickup as PickupFrom,
                    lastUpdated: new Date()
                }
            });
        }

        const BscoutingDataPull = await prisma.$queryRaw(getBests(robot, getCurrentEvent())) as any
        const BscoutingDataAvg: ScoutingDataBest = BscoutingDataPull[0];
        const bestId = await prisma.bests.findFirst({
            where: {
                teamNumber: robot,
                venue
            },
            select: {
                id: true
            }
        });
        if (BscoutingDataAvg && bestId) {
            await prisma.bests.update({
                where: {
                    id: bestId.id
                },
                data: {
                    teamNumber: robot,
                    venue: venue,
                    intake: BscoutingDataAvg.intake as IntakePosition,
                    ampauton: BscoutingDataAvg.ampauton,
                    speakerauton: BscoutingDataAvg.speakerauton,
                    ampteleop: BscoutingDataAvg.ampteleop,
                    speakerteleop: BscoutingDataAvg.speakerteleop,
                    trap: BscoutingDataAvg.trap,
                    defense: BscoutingDataAvg.defense,
                    reliability: BscoutingDataAvg.reliability,
                    hang: BscoutingDataAvg.hang,
                    pickup: BscoutingDataAvg.pickup as PickupFrom,
                    lastUpdated: new Date()
                }
            });
        }

        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}