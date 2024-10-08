import type {NextRequest} from "next/server";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {getAverages, getBests} from "@/components/fetches/sqlStatements";
import {IntakePosition, PickupFrom, ScoutingDataAvg, ScoutingDataBest} from "@/types/scoutingform";
import {PrismaClient} from "@prisma/client";
import env from "@/config/env";

const prisma = new PrismaClient({
    datasourceUrl: env.DIRECT_URL
});

async function getUpdatedDates(teamNumbers: string[], venue: string) {
    const promises = teamNumbers.map(async (teamNumber) => {
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
    });

    const results = await Promise.all(promises);
    return results.filter(entry => entry !== null);
}

async function getLatestScoutUpdate(venue: string) {
    return prisma.scoutingData.findFirst({
        where: {
            venue
        },
        orderBy: {
            submitTime: 'desc'
        },
        select: {
            submitTime: true
        }
    });
}

async function getLatestBestUpdate(venue: string) {
    return prisma.bests.findFirst({
        where: {
            venue
        },
        orderBy: {
            lastUpdated: 'desc'
        },
        select: {
            lastUpdated: true
        }
    });
}

async function getExistingAverages(teamNumbers: string[], venue: string) {
    return prisma.averages.findMany({
        where: {
            teamNumber: {
                in: teamNumbers,
            },
            venue,
        },
        select: {lastUpdated: true, id: true, teamNumber: true}
    });
}

async function getExistingBests(teamNumbers: string[], venue: string) {
    return prisma.bests.findMany({
        where: {
            teamNumber: {
                in: teamNumbers,
            },
            venue,
        },
        select: {lastUpdated: true, id: true, teamNumber: true}
    });
}

export async function GET(
    request: NextRequest,
) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return new Response('NOT AUTHORIZED', {
            status: 401,
        });
    }

    try {
        const venue = getCurrentEvent()

        const latestScoutUpdate = await getLatestScoutUpdate(venue);
        const latestBestUpdate = await getLatestBestUpdate(venue);

        if (latestScoutUpdate?.submitTime != null && latestBestUpdate?.lastUpdated != null) {
            if (latestScoutUpdate.submitTime < latestBestUpdate.lastUpdated) {
                return new Response('No new data to update', {
                    status: 200,
                });
            }
        }

        console.log("Updating data")

        const robots = await prisma.robot.findMany({
            select: {
                teamNumber: true
            }
        });

        const teamNumbers = robots.map(robot => robot.teamNumber);
        const updatedDates = (await getUpdatedDates(teamNumbers, venue));

        const existingAverages = await getExistingAverages(teamNumbers, venue);
        const existingBests = await getExistingBests(teamNumbers, venue);
        for (const entry of updatedDates) {
            if (entry !== null) {
                const existingAverage = existingAverages.find((average) => average.teamNumber === entry.teamNumber)

                if (existingAverage) {
                    if (existingAverage.lastUpdated > entry.submitTime) {
                        console.log("Skipping: ", entry.teamNumber);
                        continue
                    }
                }

                const scoutingDataPull = await prisma.$queryRaw(getAverages(entry.teamNumber, getCurrentEvent())) as any
                const scoutingDataAvg: ScoutingDataAvg = scoutingDataPull[0];
                if (!scoutingDataAvg) {
                    continue
                }

                if (!existingAverage) {
                    console.log("Creating ", entry.teamNumber)
                    await prisma.averages.create({
                        data: {
                            teamNumber: entry.teamNumber,
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
                            pickup: scoutingDataAvg.pickup as PickupFrom
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
                } else {
                    console.log("Skipping: ", entry.teamNumber)
                }
            }
        }
        for (const entry of updatedDates) {
            if (entry !== null) {
                const existingBest = existingBests.find((best) => best.teamNumber === entry.teamNumber)

                if (existingBest) {
                    if (existingBest.lastUpdated > entry.submitTime) {
                        console.log("Skipping: ", entry.teamNumber)
                        continue
                    }
                }
                const BscoutingDataPull = await prisma.$queryRaw(getBests(entry.teamNumber, getCurrentEvent())) as any
                const BscoutingDataAvg: ScoutingDataBest = BscoutingDataPull[0];
                if (!BscoutingDataAvg) {
                    continue
                }

                if (!existingBest) {
                    console.log("Creating ", entry.teamNumber)
                    await prisma.bests.create({
                        data: {
                            teamNumber: entry.teamNumber,
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
                            pickup: BscoutingDataAvg.pickup as PickupFrom
                        }
                    });
                } else if (existingBest.lastUpdated < entry.submitTime) {
                    console.log("Updating ", entry.teamNumber)
                    await prisma.bests.update({
                        where: {
                            id: existingBest.id
                        },
                        data: {
                            teamNumber: entry.teamNumber,
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
                } else {
                    console.log("we shouldnt be here")
                }
            }
        }
        prisma.$disconnect()
        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        prisma.$disconnect()
        console.error(error);
        return new Response(String(error), {
            status: 500,
        });
    }
}