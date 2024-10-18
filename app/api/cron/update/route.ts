import type {NextRequest} from "next/server";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";
import {getAverages, getBests} from "@/components/fetches/sqlStatements";
import {ScoutingDataAvg, ScoutingDataBest} from "@/types/scoutingform";
import {PrismaClient} from "@prisma/client";
import env from "@/config/env";

const prisma = new PrismaClient({
    datasourceUrl: env.DIRECT_URL
});

async function getUpdatedDates(teamNumbers: string[], venue: string) {
    return prisma.scoutingData.findMany({
        where: {
            teamNumber: { in: teamNumbers },
            venue,
        },
        orderBy: { submitTime: 'desc' },
        select: { submitTime: true, teamNumber: true }
    });
}

async function getRobotsWithData(venue: string) {
    const robots = await prisma.scoutingData.findMany({
        where: { venue },
        distinct: ['teamNumber'],
        select: { teamNumber: true }
    });
    return robots.map(robot => robot.teamNumber);
}

async function getLatestScoutUpdate(venue: string) {
    return prisma.scoutingData.findFirst({
        where: { venue },
        orderBy: { submitTime: 'desc' },
        select: { submitTime: true }
    });
}

async function getLatestBestUpdate(venue: string) {
    return prisma.bests.findFirst({
        where: { venue },
        orderBy: { lastUpdated: 'desc' },
        select: { lastUpdated: true }
    });
}

async function getExistingAverages(teamNumbers: string[], venue: string) {
    return prisma.averages.findMany({
        where: { teamNumber: { in: teamNumbers }, venue },
        select: { lastUpdated: true, id: true, teamNumber: true }
    });
}

async function getExistingBests(teamNumbers: string[], venue: string) {
    return prisma.bests.findMany({
        where: { teamNumber: { in: teamNumbers }, venue },
        select: { lastUpdated: true, id: true, teamNumber: true }
    });
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return new Response('NOT AUTHORIZED', { status: 401 });
    }

    try {
        const venue = getCurrentEvent();
        const [latestScoutUpdate, latestBestUpdate] = await Promise.all([
            getLatestScoutUpdate(venue),
            getLatestBestUpdate(venue)
        ]);

        if (latestScoutUpdate?.submitTime && latestBestUpdate?.lastUpdated &&
            latestScoutUpdate.submitTime < latestBestUpdate.lastUpdated) {
            return new Response('No new data to update', { status: 200 });
        }

        const teamNumbers = await getRobotsWithData(venue);
        if (teamNumbers.length === 0) {
            return new Response('No robots with data', { status: 200 });
        }

        const [updatedDates, existingAverages, existingBests] = await Promise.all([
            getUpdatedDates(teamNumbers, venue),
            getExistingAverages(teamNumbers, venue),
            getExistingBests(teamNumbers, venue)
        ]);

        for (const entry of updatedDates) {
            if (!entry) continue;
            const { teamNumber, submitTime } = entry;
            const existingAverage = existingAverages.find(avg => avg.teamNumber === teamNumber);
            const shouldUpdateAverage = !existingAverage || existingAverage.lastUpdated < submitTime;

            if (shouldUpdateAverage) {
                const scoutingDataPull = await prisma.$queryRaw(getAverages(teamNumber, venue)) as any;
                const scoutingDataAvg: ScoutingDataAvg = scoutingDataPull[0];

                if (scoutingDataAvg) {
                    if (!existingAverage) {
                        await prisma.averages.create({
                            data: { ...scoutingDataAvg, teamNumber, venue }
                        });
                    } else {
                        await prisma.averages.update({
                            where: { id: existingAverage.id },
                            data: { ...scoutingDataAvg, lastUpdated: new Date() }
                        });
                    }
                }
            }
        }

        for (const entry of updatedDates) {
            if (!entry) continue;
            const { teamNumber, submitTime } = entry;
            const existingBest = existingBests.find(best => best.teamNumber === teamNumber);
            const shouldUpdateBest = !existingBest || existingBest.lastUpdated < submitTime;

            if (shouldUpdateBest) {
                const BscoutingDataPull = await prisma.$queryRaw(getBests(teamNumber, venue)) as any;
                const BscoutingDataAvg: ScoutingDataBest = BscoutingDataPull[0];

                if (BscoutingDataAvg) {
                    if (!existingBest) {
                        await prisma.bests.create({
                            data: { ...BscoutingDataAvg, teamNumber, venue }
                        });
                    } else {
                        await prisma.bests.update({
                            where: { id: existingBest.id },
                            data: { ...BscoutingDataAvg, lastUpdated: new Date() }
                        });
                    }
                }
            }
        }

        prisma.$disconnect();
        return new Response('Success', { status: 200 });

    } catch (error) {
        prisma.$disconnect();
        console.error('Error during update:', error);
        return new Response(String(error), { status: 500 });
    }
}