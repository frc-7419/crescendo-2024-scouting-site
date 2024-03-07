import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";
import TeamData from "@/types/TeamData";

const calculateContinuousAverage = (teamData: TeamData) => {
    let total = 0;
    let contAvg: any[] = [];
    let lastVal: number = 0;
    teamData.scoutingData.forEach((entry, index) => {
        total += entry.auton.amp + entry.auton.speaker + entry.teleop.amp + entry.teleop.speaker;
        const count = index + 1;
        const continuousAverage = Number((total / count).toFixed(2))
        contAvg.push({
            continuousAverage: continuousAverage,
            percentChange: ((lastVal - continuousAverage) / lastVal).toFixed(1),
            match: entry.matchNumber
        });
        lastVal = continuousAverage
    });
    return contAvg;
}

async function getTop(venue: string) {
    const bests = await prisma.bests.findMany({
        where: {venue},
        select: {teamNumber: true, ampauton: true, speakerauton: true, ampteleop: true, speakerteleop: true},
        cacheStrategy: {
            ttl: 60,
        },
    });

    const sortedbests = bests.sort((a, b) => {
        const sumA = a.ampauton + a.speakerauton + a.ampteleop + a.speakerteleop;
        const sumB = b.ampauton + b.speakerauton + b.ampteleop + b.speakerteleop;
        return sumB - sumA;
    });


    const data = sortedbests.slice(0, 16);
    const teamNumbers = data.map(team => team.teamNumber);
    const scoutingData = await prisma.robot.findMany({
        where: {teamNumber: {in: teamNumbers}},
        select: {
            teamNumber: true,
            scoutingData: {
                select: {
                    auton: {
                        select: {
                            amp: true,
                            speaker: true,
                        },
                    },
                    teleop: {
                        select: {
                            amp: true,
                            speaker: true,
                        },
                    },
                    matchNumber: true,
                },
            },
        },
        cacheStrategy: {
            ttl: 60,
        },
    });

    const reorderedScoutingData = teamNumbers.map(teamNumber => {
        return scoutingData.find(team => team.teamNumber === teamNumber);
    });

    const responseData: any = {};

    reorderedScoutingData.forEach((team) => {
        if (team) {
            responseData[team.teamNumber] = calculateContinuousAverage(team as TeamData);
        }
    });

    const responseBody = JSON.stringify(responseData);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length.toString(),
    };

    return new Response(responseBody, {
        status: 200,
        headers: headers,
    });
}


export async function GET(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams
    const venue = searchParams.get('venue') as string;

    /*
    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }
    */
    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    if (!venue) return new Response("No venue provided", {
        status: 500,
    });
    try {
        return await getTop(venue);
    } catch (error) {
        console.error('Error retrieving scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}