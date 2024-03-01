import type {NextRequest} from "next/server";
import {getCurrentEvent} from "@/components/getCurrentEvent";
import prisma from "@/lib/prisma";
import {getAverages} from "@/components/fetches/sqlStatements";
import {ScoutingDataAvg} from "@/types/scoutingform";

export async function GET(
    request: NextRequest,
) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('NOT AUTHORIZED', {
            status: 401,
        });
    }

    try {
        const robots = await prisma.robot.findMany({
            select: {
                teamNumber: true
            }
        });

        const teamNumbers = robots.map(robot => robot.teamNumber);
        const venue = getCurrentEvent()
        const updatedDates = (await Promise.all(teamNumbers.map(async (teamNumber) => {
            return prisma.scoutingData.findFirst({
                where: {
                    teamNumber,
                    venue
                },
                orderBy: {
                    submitTime: 'desc'
                },
                select: {
                    submitTime: true,
                    teamNumber: true
                }
            });
        }))).filter(entry => entry !== null);
        console.log(updatedDates)

        for (const entry of updatedDates) {
            if (entry !== null) {
                const existingAverage = await prisma.averages.findFirst({
                    where: {
                        teamNumber: entry.teamNumber,
                        venue: venue
                    }
                });

                const scoutingDataPull = await prisma.$queryRaw(getAverages(entry.teamNumber, getCurrentEvent())) as any
                const scoutingDataAvg: ScoutingDataAvg = scoutingDataPull[0];
                if (!scoutingDataAvg) {
                    return;
                }

                if (!existingAverage) {
                    console.log("Creating ", entry.teamNumber)
                    await prisma.averages.create({
                        data: {
                            teamNumber: entry.teamNumber,
                            venue: venue,
                            avgampauton: scoutingDataAvg.avgampauton,
                            avgspeakerauton: scoutingDataAvg.avgspeakerauton,
                            avgampteleop: scoutingDataAvg.avgampteleop,
                            avgspeakerteleop: scoutingDataAvg.avgspeakerteleop,
                            avgtimesamped: scoutingDataAvg.avgtimesamped,
                            avgtrap: scoutingDataAvg.avgtrap,
                            avgdefense: scoutingDataAvg.avgdefense,
                            avgreliability: scoutingDataAvg.avgreliability,
                        }
                    });
                } else if (existingAverage.lastUpdated < entry.submitTime) {
                    console.log("Updating ", entry.teamNumber)
                    await prisma.averages.update({
                        where: {
                            id: existingAverage.id
                        },
                        data: {
                            teamNumber: entry.teamNumber,
                            venue: venue,
                            avgampauton: scoutingDataAvg.avgampauton,
                            avgspeakerauton: scoutingDataAvg.avgspeakerauton,
                            avgampteleop: scoutingDataAvg.avgampteleop,
                            avgspeakerteleop: scoutingDataAvg.avgspeakerteleop,
                            avgtimesamped: scoutingDataAvg.avgtimesamped,
                            avgtrap: scoutingDataAvg.avgtrap,
                            avgdefense: scoutingDataAvg.avgdefense,
                            avgreliability: scoutingDataAvg.avgreliability,
                            lastUpdated: new Date()
                        }
                    });
                } else {
                    console.log("skipping update as it already exists")
                }
            }
        }
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        });
    }

    return new Response('Success', {
        status: 200,
    });
}